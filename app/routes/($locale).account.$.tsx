import {redirect} from '@shopify/remix-oxygen';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

export async function loader({context, params}: LoaderFunctionArgs) {
  const customerAccessToken = await context.session.get('customerAccessToken');
  if (customerAccessToken) {
    return redirect(
      params.locale ? `/${params.locale}/account/orders` : '/account/orders',
    );
  }
  return redirect(
    params.locale ? `/${params.locale}/account/login` : '/account/login',
  );
}
