import type {ActionFunctionArgs, AppLoadContext} from '@shopify/remix-oxygen';

import {passwordResetClient} from '~/lib/customer';

const getResetFormError = (
  error: string | unknown,
  context: AppLoadContext,
) => {
  if (context.storefront.isApiError(error)) {
    return 'Something went wrong. Please try again later.';
  } else {
    return 'Sorry. We could not update your password.';
  }
};

interface Data {
  errors: string[] | null;
  formErrors: string[] | null;
}

export const customerPasswordResetAction = async ({
  request,
  context,
}: {
  request: ActionFunctionArgs['request'];
  context: ActionFunctionArgs['context'];
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
    const password = String(body?.get('password') || '');
    const url = String(body?.get('url') || '');

    const {errors} = await passwordResetClient(context, {
      password,
      url,
    });

    if (errors?.length) {
      console.error('passwordResetClient:errors', errors);
      data.errors = errors;
      data.formErrors = errors;
      return {data, status: 400};
    }

    return {data, status: 200};
  } catch (error) {
    console.error('customerPasswordResetAction:error', error);
    data.errors = [error as string];
    data.formErrors = [getResetFormError(error, context)];
    return {data, status: 500};
  }
};
