import type {ActionFunctionArgs} from '@shopify/remix-oxygen';
import type {MailingAddress} from '@shopify/hydrogen/storefront-api-types';

import {
  addressCreateClient,
  addressDeleteClient,
  addressUpdateClient,
} from './client';

const ACTIONS = ['create-address', 'update-address', 'delete-address'];

const getAddressFromBody = (body?: FormData) => {
  if (!body) return null;
  return {
    firstName: body.get('firstName') || '',
    lastName: body.get('lastName') || '',
    company: body.get('company') || '',
    address1: body.get('address1') || '',
    address2: body.get('address2') || '',
    city: body.get('city') || '',
    zoneCode: body.get('zoneCode') || '',
    zip: body.get('zip') || '',
    territoryCode: body.get('territoryCode') || '',
    phoneNumber: body.get('phoneNumber') || '',
  };
};

const getFormError = (message = 'We could not perform this address action') => {
  return `Sorry. ${message}. Please try again later.`;
};

interface ActionData {
  errors: string[] | null;
  addressesClient: MailingAddress[] | null;
  formErrors: string[] | null;
  address?: MailingAddress | null;
  defaultAddress?: MailingAddress | null;
  deletedCustomerAddressId?: string | null;
  createErrors?: string[] | null;
  updateErrors?: string[] | null;
  deleteErrors?: string[] | null;
}

export const customerAddressesAction = async ({
  request,
  context,
}: {
  request: ActionFunctionArgs['request'];
  context: ActionFunctionArgs['context'];
}): Promise<{data: ActionData; status: number}> => {
  const data: ActionData = {
    errors: null,
    addressesClient: null,
    formErrors: null,
  };
  let action = null;
  try {
    let body;
    try {
      body = await request.formData();
    } catch (error) {}

    action = String(body?.get('action') || '');

    if (!action) {
      data.errors = ['Missing action'];
      return {data, status: 500};
    }
    if (!ACTIONS.includes(action)) {
      data.errors = ['Invalid action'];
      return {data, status: 500};
    }

    /* --- CREATE ADDRESS --- */
    if (action === 'create-address') {
      const address = getAddressFromBody(body);
      if (!address) {
        data.formErrors = ['Missing address'];
        return {data, status: 400};
      }
      const isDefault = body?.get('isDefault') === 'true';

      const {response, apiErrors, formErrors} = await addressCreateClient(
        context,
        {address, isDefault},
      );
      const errors = [...new Set([...apiErrors, ...formErrors])];
      if (errors.length) {
        console.error('addressCreateClient:errors', errors);
        data.createErrors = apiErrors;
        data.formErrors = formErrors;
        return {data, status: 400};
      }
      if (response?.address) {
        data.address = response.address;
      }
    }

    /* --- UPDATE ADDRESS --- */
    if (action === 'update-address') {
      const address = getAddressFromBody(body);
      if (!address) {
        data.formErrors = ['Missing address'];
        return {data, status: 400};
      }
      const addressId = String(body?.get('id') || '');
      const isDefault = body?.get('isDefault') === 'true';

      const {response, apiErrors, formErrors} = await addressUpdateClient(
        context,
        {address, addressId, isDefault},
      );

      const errors = [...new Set([...apiErrors, ...formErrors])];
      if (errors.length) {
        console.error('addressUpdateClient:errors', errors);
        data.updateErrors = apiErrors;
        data.formErrors = formErrors;
        return {data, status: 400};
      }
      if (response?.address) {
        data.address = response.address;
      }
    }

    /* --- DELETE ADDRESS --- */
    if (action === 'delete-address') {
      const addressId = String(body?.get('id') || '');
      const {apiErrors, formErrors} = await addressDeleteClient(context, {
        addressId,
      });

      const errors = [...new Set([...apiErrors, ...formErrors])];
      if (errors?.length) {
        console.error('addressDeleteClient:errors', errors);
        data.deleteErrors = apiErrors;
        data.formErrors = formErrors;
        return {data, status: 400};
      }
    }

    return {data, status: 200};
  } catch (error) {
    console.error('customerOrdersLoader:error', error);
    data.errors = [error as string];
    if (!action) {
      data.formErrors = [getFormError()];
    }
    if (action === 'create-address') {
      data.formErrors = [getFormError('We could not create this address')];
    }
    if (action === 'update-address') {
      data.formErrors = [getFormError('We could not update this address')];
    }
    return {data, status: 500};
  }
};
