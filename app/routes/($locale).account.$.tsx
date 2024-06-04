import {redirect} from '@shopify/remix-oxygen';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {LOGGED_OUT_REDIRECT_TO, LOGGED_IN_REDIRECT_TO} from '~/lib/constants';

export async function loader({context, params}: LoaderFunctionArgs) {
  const customerAccessToken = await context.session.get('customerAccessToken');
  if (customerAccessToken) {
    return redirect(
      params.locale
        ? `/${params.locale}${LOGGED_IN_REDIRECT_TO}`
        : LOGGED_IN_REDIRECT_TO,
    );
  }
  return redirect(
    params.locale
      ? `/${params.locale}${LOGGED_OUT_REDIRECT_TO}`
      : LOGGED_OUT_REDIRECT_TO,
  );
}
