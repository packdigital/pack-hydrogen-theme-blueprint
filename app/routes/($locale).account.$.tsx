import {redirect} from '@shopify/remix-oxygen';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

export async function loader({context, params}: LoaderFunctionArgs) {
  context.customerAccount.handleAuthStatus();
  const locale = params.locale;
  return redirect(locale ? `/${locale}/account` : '/account');
}
