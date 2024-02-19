import {json, redirect} from '@shopify/remix-oxygen';
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {AnalyticsPageType} from '@shopify/hydrogen';

import {customerLoginRegisterAction} from '~/lib/customer';
import {getAccountSeo} from '~/lib/utils';
import {Login} from '~/components';

export async function action({request, context}: ActionFunctionArgs) {
  const {session} = context;
  const {data, status} = await customerLoginRegisterAction({request, context});
  const customerAccessToken = data.customerAccessToken;
  if (customerAccessToken) {
    session.set('customerAccessToken', customerAccessToken);
    return json(data, {headers: {'Set-Cookie': await session.commit()}});
  }
  return json(data, {status});
}

export async function loader({context, params}: LoaderFunctionArgs) {
  const customerAccessToken = await context.session.get('customerAccessToken');
  if (customerAccessToken) {
    return redirect(
      params.locale ? `/${params.locale}/account/orders` : '/account/orders',
    );
  }
  const analytics = {pageType: AnalyticsPageType.customersLogin};
  const seo = await getAccountSeo(context, 'Login');
  return json({analytics, seo});
}

export default function LoginRoute() {
  return <Login />;
}

LoginRoute.displayName = 'LoginRoute';
