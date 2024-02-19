import type {AppLoadContext, ActionFunctionArgs} from '@shopify/remix-oxygen';
import type {
  Customer,
  CustomerAccessToken,
} from '@shopify/hydrogen/storefront-api-types';

import {customerUpdateClient} from '~/lib/customer';

const getFormError = (error: string | unknown, context: AppLoadContext) => {
  if (context.storefront.isApiError(error)) {
    return 'Something went wrong. Please try again later.';
  } else {
    return 'Sorry. We could not update your profile. Please try again later.';
  }
};

interface Data {
  errors: string[] | null;
  customer: Customer | null;
  customerAccessToken: CustomerAccessToken | null;
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
    customer: null,
    customerAccessToken: null,
    formErrors: null,
  };
  try {
    const customerAccessToken = await context.session.get(
      'customerAccessToken',
    );

    if (!customerAccessToken) {
      data.errors = ['Cannot find customer access token'];
      return {data, status: 401};
    }

    const body = await request.formData();

    const customer = {
      firstName: body.get('firstName') || '',
      lastName: body.get('lastName') || '',
    };
    const {errors, response} = await customerUpdateClient(context, {
      customerAccessToken,
      customer,
    });

    if (errors?.length) {
      console.error('customerUpdateClient:errors', errors);
      data.errors = errors;
      data.formErrors = errors;
      return {data, status: 400};
    }

    const {customerAccessToken: renewedAccessToken, customer: updatedCustomer} =
      {
        ...response,
      };
    if (renewedAccessToken) {
      console.log(
        'customerUpdateClient:customerAccessToken',
        renewedAccessToken,
      );
      data.customerAccessToken = renewedAccessToken;
    }
    if (updatedCustomer) {
      console.log('customerUpdateClient:updatedCustomer', updatedCustomer);
      data.customer = updatedCustomer;
    }

    return {data, status: 200};
  } catch (error) {
    console.error('customerUpdateProfileAction:error', error);
    data.errors = [error as string];
    data.formErrors = [getFormError(error, context)];
    return {data, status: 500};
  }
};
