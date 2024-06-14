import type {ActionFunctionArgs, AppLoadContext} from '@shopify/remix-oxygen';

import {customerActivateClient} from '~/lib/customer';

const getActivateFormError = (
  error: string | unknown,
  context: AppLoadContext,
) => {
  if (context.storefront.isApiError(error)) {
    return 'Something went wrong. Please try again later.';
  } else {
    return 'Sorry. We could not activate your account.';
  }
};

interface Data {
  errors: string[] | null;
  formErrors: string[] | null;
}

export const customerActivateAction = async ({
  request,
  context,
}: {
  request: ActionFunctionArgs['request'];
  context: AppLoadContext;
}): Promise<{data: Data; status: number}> => {
  const data: Data = {
    errors: null,
    formErrors: null,
  };
  try {
    let body;
    try {
      body = await request.formData();
    } catch (error) {}
    const customerId = String(body?.get('customerId') || '');
    const activationToken = String(body?.get('activationToken') || '');
    const password = String(body?.get('password') || '');

    const {errors} = await customerActivateClient(context, {
      customerId,
      activationToken,
      password,
    });

    if (errors?.length) {
      console.error('customerActivate:errors', errors);
      data.errors = errors;
      data.formErrors = errors;
      return {data, status: 400};
    }

    return {data, status: 200};
  } catch (error) {
    console.error('customerActivateAction:error', error);
    data.errors = [error as string];
    data.formErrors = [getActivateFormError(error, context)];
    return {data, status: 500};
  }
};
