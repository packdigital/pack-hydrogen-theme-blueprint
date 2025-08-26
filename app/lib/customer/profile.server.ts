import type {AppLoadContext, ActionFunctionArgs} from '@shopify/remix-oxygen';
import type {Customer} from '@shopify/hydrogen/customer-account-api-types';

import {customerUpdateClient} from './client';

const getFormError = (message = 'We could not perform this address action') => {
  return `Sorry. ${message}. Please try again later.`;
};

interface Data {
  errors: string[] | null;
  formErrors: string[] | null;
}

export const customerUpdateProfileAction = async ({
  request,
  context,
}: {
  request: ActionFunctionArgs['request'];
  context: AppLoadContext;
}): Promise<{
  data: Data;
  status: number;
}> => {
  const data: Data = {
    errors: null,
    formErrors: null,
  };
  try {
    let body;
    try {
      body = await request.formData();
    } catch (error) {}

    const firstName = String(body?.get('firstName') || '');
    const lastName = String(body?.get('lastName') || '');

    if (!firstName || !lastName) {
      data.errors = ['First name and last name are required'];
      data.formErrors = ['First name and last name are required'];
      return {data, status: 400};
    }

    const customer = {firstName, lastName} as Customer;
    const {apiErrors, formErrors} = await customerUpdateClient(context, {
      customer,
    });

    const errors = [...new Set([...apiErrors, ...formErrors])];
    if (errors?.length) {
      console.error('customerUpdateClient:errors', errors);
      data.errors = apiErrors;
      data.formErrors = formErrors;
      return {data, status: 400};
    }

    return {data, status: 200};
  } catch (error) {
    console.error('customerUpdateProfileAction:error', error);
    data.errors = [error as string];
    data.formErrors = [getFormError()];
    return {data, status: 500};
  }
};
