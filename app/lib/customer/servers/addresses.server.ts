import type {AppLoadContext, ActionFunctionArgs} from '@shopify/remix-oxygen';
import type {MailingAddress} from '@shopify/hydrogen/storefront-api-types';

import {
  addressCreateClient,
  addressDeleteClient,
  addressesClient,
  addressUpdateClient,
} from '~/lib/customer';

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
    province: body.get('province') || '',
    zip: body.get('zip') || '',
    country: body.get('country') || '',
    phone: body.get('phone') || '',
  };
};

const getFormError = (
  error: string | unknown,
  context: AppLoadContext,
  message = 'We could not perform this address action',
) => {
  if (context.storefront.isApiError(error)) {
    return 'Something went wrong. Please try again later.';
  } else {
    return `Sorry. ${message}. Please try again later.`;
  }
};

interface LoaderData {
  errors: string[] | null;
  addressesClient: MailingAddress[] | null;
}

export const customerAddressesLoader = async ({
  context,
}: {
  context: ActionFunctionArgs['context'];
}): Promise<{data: LoaderData; status: number}> => {
  const data: LoaderData = {
    errors: null,
    addressesClient: null,
  };
  try {
    const customerAccessToken = await context.session.get(
      'customerAccessToken',
    );

    if (!customerAccessToken) {
      data.errors = ['Cannot find customer access token'];
      return {data, status: 401};
    }

    const {errors, response} = await addressesClient(context, {
      customerAccessToken,
    });

    if (errors?.length) {
      console.error('addressesClient:errors', errors);
      data.errors = errors;
      return {data, status: 400};
    }

    if (response?.addressesClient) {
      data.addressesClient = response.addressesClient;
    }

    return {data, status: 200};
  } catch (error) {
    console.error('customerOrdersLoader:error', error);
    data.errors = [error];
    return {data, status: 500};
  }
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

    let customerAccessToken = await context.session.get('customerAccessToken');
    /* in customizer, customer access token is stored in local storage, so it needs to be passed */
    const previewModeCustomerAccessToken = String(
      body?.get('previewModeCustomerAccessToken') || '',
    );
    if (previewModeCustomerAccessToken) {
      try {
        customerAccessToken = JSON.parse(previewModeCustomerAccessToken);
      } catch (error) {}
    }

    if (!customerAccessToken) {
      data.errors = ['Cannot find customer access token'];
      return {data, status: 401};
    }

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

      const {errors, response} = await addressCreateClient(context, {
        customerAccessToken,
        address,
        isDefault,
      });

      if (errors?.length) {
        console.error('addressCreateClient:errors', errors);
        data.createErrors = errors;
        data.formErrors = errors;
        return {data, status: 400};
      }
      if (response?.address) {
        data.address = response.address;
      }
      if (response?.defaultAddress) {
        data.defaultAddress = response.defaultAddress;
      }
    }

    /* --- UPDATE ADDRESS --- */
    if (action === 'update-address') {
      const address = getAddressFromBody(body);
      if (!address) {
        data.formErrors = ['Missing address'];
        return {data, status: 400};
      }
      const id = String(body?.get('id') || '');
      const isDefault = body?.get('isDefault') === 'true';

      const {errors, response} = await addressUpdateClient(context, {
        customerAccessToken,
        address,
        id,
        isDefault,
      });

      if (errors?.length) {
        console.error('addressUpdateClient:errors', errors);
        data.updateErrors = errors;
        data.formErrors = errors;
        return {data, status: 400};
      }
      if (response?.address) {
        data.address = response.address;
      }
      if (response?.defaultAddress) {
        data.defaultAddress = response.defaultAddress;
      }
    }

    /* --- DELETE ADDRESS --- */
    if (action === 'delete-address') {
      const id = String(body?.get('id') || '');
      const {errors, response} = await addressDeleteClient(context, {
        customerAccessToken,
        id,
      });

      if (errors?.length) {
        console.error('addressDeleteClient:errors', errors);
        data.deleteErrors = errors;
        return {data, status: 400};
      }
      if (response?.deletedCustomerAddressId) {
        data.deletedCustomerAddressId = response.deletedCustomerAddressId;
      }
    }

    return {data, status: 200};
  } catch (error) {
    console.error('customerOrdersLoader:error', error);
    data.errors = [error as string];
    if (!action) {
      data.formErrors = [getFormError(error, context)];
    }
    if (action === 'create-address') {
      data.formErrors = [
        getFormError(error, context, 'We could not create this address'),
      ];
    }
    if (action === 'update-address') {
      data.formErrors = [
        getFormError(error, context, 'We could not update this address'),
      ];
    }
    return {data, status: 500};
  }
};
