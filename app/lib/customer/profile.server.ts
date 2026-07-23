import type {Customer} from '@shopify/hydrogen/customer-account-api-types';
import type {AppLoadContext} from 'react-router';

import {
  customerEmailMarketingUpdateClient,
  customerUpdateClient,
} from './client';

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
  request: Request;
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

    // Unchecked checkboxes are omitted from FormData, so absence means opted out.
    const acceptsMarketing =
      String(body?.get('acceptsMarketing') || '') === 'on';
    // Hidden field capturing the marketing state at page load, so we only call
    // the subscribe/unsubscribe mutation when the customer actually changed it.
    const acceptsMarketingInitial =
      String(body?.get('acceptsMarketingInitial') || '') === 'true';

    const apiErrors: string[] = [];
    const formErrors: string[] = [];

    const customer = {firstName, lastName} as Customer;
    const {apiErrors: updateApiErrors, formErrors: updateFormErrors} =
      await customerUpdateClient(context, {customer});
    apiErrors.push(...updateApiErrors);
    formErrors.push(...updateFormErrors);

    // Marketing consent lives outside customerUpdate — it has dedicated
    // subscribe/unsubscribe mutations in the Customer Account API.
    if (acceptsMarketing !== acceptsMarketingInitial) {
      const {apiErrors: marketingApiErrors, formErrors: marketingFormErrors} =
        await customerEmailMarketingUpdateClient(context, {
          subscribe: acceptsMarketing,
        });
      apiErrors.push(...marketingApiErrors);
      formErrors.push(...marketingFormErrors);
    }

    const errors = [...new Set([...apiErrors, ...formErrors])];
    if (errors?.length) {
      console.error('customerUpdateProfileAction:errors', errors);
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
