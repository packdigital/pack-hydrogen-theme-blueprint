import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {Order} from '@shopify/hydrogen/storefront-api-types';

import {customerOrdersClient} from '~/lib/customer';

type Data = {
  errors: string[] | null;
  orders: Order[] | null;
};

export const customerOrdersLoader = async ({
  context,
  request,
}: {
  context: LoaderFunctionArgs['context'];
  request: LoaderFunctionArgs['request'];
}): Promise<{
  data: Data;
  status: number;
}> => {
  const data: Data = {
    errors: null,
    orders: null,
  };
  try {
    let body;
    try {
      body = await request.formData();
    } catch (error) {}

    let customerAccessToken = await context.session.get('customerAccessToken');
    /* in customizer, customer access token is stored in local storage, so it needs to be passed in */
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

    const {errors, response} = await customerOrdersClient(context, {
      customerAccessToken,
      first: 250,
    });

    if (errors?.length) {
      console.error('customerOrdersClient:error', errors[0]);
      data.errors = errors;
      return {data, status: 400};
    }

    if (response?.orders) {
      data.orders = response.orders;
    }

    return {data, status: 200};
  } catch (error) {
    console.error('customerOrdersLoader:error', error);
    data.errors = [error];
    return {data, status: 500};
  }
};

export const customerOrdersAction = customerOrdersLoader;
