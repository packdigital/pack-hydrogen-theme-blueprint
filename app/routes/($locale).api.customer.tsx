import {data as dataWithOptions} from '@shopify/remix-oxygen';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {customerGetClient} from '~/lib/customer';

export async function loader({context, request}: LoaderFunctionArgs) {
  try {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    const customerAccessTokenString = String(
      searchParams.get('customerAccessToken') || '',
    );
    const customerAccessToken = JSON.parse(customerAccessTokenString);

    const {errors, response} = await customerGetClient(context, {
      customerAccessToken,
    });

    if (errors?.length) {
      console.error('/api/customer:error', errors);
      return dataWithOptions({customer: null, errors}, {status: 400});
    }

    return {
      customer: response?.customer || null,
    };
  } catch (error) {
    console.error('/api/customer:error', error);
    return dataWithOptions({customer: null, errors: [error]}, {status: 500});
  }
}
