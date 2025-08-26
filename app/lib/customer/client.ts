import type {AppLoadContext} from '@shopify/remix-oxygen';
import type {Customer} from '@shopify/hydrogen/customer-account-api-types';

import {
  DELETE_ADDRESS_MUTATION,
  CREATE_ADDRESS_MUTATION,
  UPDATE_ADDRESS_MUTATION,
  CUSTOMER_UPDATE_MUTATION,
} from '~/data/graphql/customer-account/customer';

const formatError = (error = '') => {
  let _error = error;
  _error = _error.replace(/^\[\S+\]/g, '');
  _error = _error.replace(/(- Request ID:).+$/g, '');
  _error = _error.replace(/(: {).+$/g, '');
  return _error.trim();
};

const errorsResponse = (errors: any) => {
  const _errors = Array.isArray(errors?.message)
    ? errors.message.map(formatError)
    : [formatError(errors.message)];
  return {
    apiErrors: _errors,
    formErrors: _errors,
    response: null,
  };
};

export const addressCreateClient = async (
  context: AppLoadContext,
  {
    address,
    isDefault,
  }: {
    address: Record<string, any>;
    isDefault?: boolean;
  },
) => {
  try {
    const {customerAccount} = context;

    if (!address) {
      throw new Error('The address is missing from the request.');
    }

    const {data, errors: createErrors} = await customerAccount.mutate(
      CREATE_ADDRESS_MUTATION,
      {variables: {address, defaultAddress: isDefault}},
    );

    const apiErrors = createErrors?.map((error) => error?.message) || [];
    const formErrors =
      data?.customerAddressCreate?.userErrors?.map((error) => error?.message) ||
      [];
    const customerAddress = data?.customerAddressCreate?.customerAddress;
    if (!customerAddress?.id) {
      if (!apiErrors.length)
        apiErrors.push(
          formErrors[0] || 'Expected customer address to be created.',
        );
      if (!formErrors.length)
        formErrors.push('Customer address could not be created at this time.');
    }

    return {
      apiErrors,
      formErrors,
      response: {address: customerAddress},
    };
  } catch (error) {
    return errorsResponse(error);
  }
};

export const addressUpdateClient = async (
  context: AppLoadContext,
  {
    addressId,
    address,
    isDefault,
  }: {
    addressId: string;
    address: Record<string, any>;
    isDefault?: boolean;
  },
) => {
  try {
    const {customerAccount} = context;

    if (!address) {
      throw new Error('The address is missing from the request.');
    }
    if (!addressId) {
      throw new Error('The address ID is missing from the request.');
    }

    const {data, errors: updateErrors} = await customerAccount.mutate(
      UPDATE_ADDRESS_MUTATION,
      {
        variables: {
          address,
          addressId,
          defaultAddress: isDefault,
        },
      },
    );

    const apiErrors = updateErrors?.map((error) => error?.message) || [];
    const formErrors =
      data?.customerAddressUpdate?.userErrors?.map((error) => error?.message) ||
      [];
    const customerAddress = data?.customerAddressUpdate?.customerAddress;
    if (!customerAddress?.id) {
      if (!apiErrors.length)
        apiErrors.push(
          formErrors[0] || 'Expected customer address to be updated.',
        );
      if (!formErrors.length)
        formErrors.push('Customer address could not be updated at this time.');
    }

    return {
      apiErrors,
      formErrors,
      response: {address: customerAddress},
    };
  } catch (error) {
    return errorsResponse(error);
  }
};

export const addressDeleteClient = async (
  context: AppLoadContext,
  {addressId}: {addressId: string},
) => {
  try {
    const {customerAccount} = context;

    if (!addressId) {
      throw new Error('The address ID is missing from the request.');
    }

    const {data, errors: deleteErrors} = await customerAccount.mutate(
      DELETE_ADDRESS_MUTATION,
      {variables: {addressId}},
    );

    const apiErrors = deleteErrors?.map((error) => error?.message) || [];
    const formErrors =
      data?.customerAddressCreate?.userErrors?.map((error) => error?.message) ||
      [];
    const deletedCustomerAddressId =
      data?.customerAddressDelete?.deletedAddressId;
    if (!deletedCustomerAddressId) {
      if (!apiErrors.length)
        apiErrors.push(
          formErrors[0] || 'Expected customer address to be deleted.',
        );
      if (!formErrors.length)
        formErrors.push('Customer address could not be deleted at this time.');
    }

    return {
      apiErrors,
      formErrors,
      response: {deletedCustomerAddressId},
    };
  } catch (error) {
    return errorsResponse(error);
  }
};

export const customerUpdateClient = async (
  context: AppLoadContext,
  {customer}: {customer: Customer},
) => {
  try {
    const {customerAccount} = context;

    if (!customer) {
      throw new Error('Customer details are missing from the request.');
    }

    const {data, errors: updateErrors} = await customerAccount.mutate(
      CUSTOMER_UPDATE_MUTATION,
      {variables: {customer}},
    );

    const apiErrors = updateErrors?.map((error) => error?.message) || [];
    const formErrors =
      data?.customerUpdate?.userErrors?.map((error) => error?.message) || [];

    return {
      apiErrors,
      formErrors,
      response: null,
    };
  } catch (error) {
    return errorsResponse(error);
  }
};
