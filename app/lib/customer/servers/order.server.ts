import type {ActionFunctionArgs} from '@shopify/remix-oxygen';
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
  context: ActionFunctionArgs['context'];
  params: ActionFunctionArgs['params'];
}): Promise<{
  data: Data;
  status: number;
}> => {
  const data: Data = {
    errors: null,
    order: null,
  };
  try {
    const customerAccessToken = await context.session.get(
      'customerAccessToken',
    );

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
