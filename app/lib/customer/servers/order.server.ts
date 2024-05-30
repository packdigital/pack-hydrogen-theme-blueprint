import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {Order} from '@shopify/hydrogen/storefront-api-types';

import {customerOrderClient} from '~/lib/customer';

type Data = {
  errors: string[] | null;
  order: Order | null;
};

export const customerOrderLoader = async ({
  request,
  context,
  params,
}: {
  request: Request;
  context: LoaderFunctionArgs['context'];
  params: LoaderFunctionArgs['params'];
}): Promise<{
  data: Data;
  status: number;
}> => {
  const data: Data = {
    errors: null,
    order: null,
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

    const queryParams = new URL(request.url).searchParams;
    const orderToken = queryParams.get('key');

    if (!orderToken) {
      data.errors = ['Missing order token'];
      return {data, status: 400};
    }

    const orderId = `gid://shopify/Order/${params.id}?key=${orderToken}`;

    const {errors, response} = await customerOrderClient(context, {
      customerAccessToken,
      id: orderId,
    });

    if (errors?.length) {
      console.error('customerOrderClient:errors', errors);
      data.errors = errors;
      return {data, status: 400};
    }

    if (response?.order) {
      data.order = response.order;
    }

    return {data, status: 200};
  } catch (error) {
    console.error('customerOrderLoader:error', error);
    data.errors = [error as string];
    return {data, status: 500};
  }
};

export const customerOrderAction = customerOrderLoader;
