import {json, redirect} from '@shopify/remix-oxygen';
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {AnalyticsPageType} from '@shopify/hydrogen';

import {customerLoginRegisterAction} from '~/lib/customer';
import {getAccountSeo} from '~/lib/utils';
import {Register} from '~/components';

export async function action({request, context}: ActionFunctionArgs) {
  const {session} = context;
  const {data, status} = await customerLoginRegisterAction({request, context});
  const customerAccessToken = data.customerAccessToken;
  if (customerAccessToken) {
    session.set('customerAccessToken', customerAccessToken);
    return json(data, {headers: {'Set-Cookie': await session.commit()}});
  }
  return json({...data}, {status});
}

export async function loader({context, params}: LoaderFunctionArgs) {
  const customerAccessToken = await context.session.get('customerAccessToken');
  if (customerAccessToken) {
    return redirect(
      params.locale ? `/${params.locale}/account/orders` : '/account/orders',
    );
  }
  const analytics = {pageType: AnalyticsPageType.customersRegister};
  const seo = await getAccountSeo(context, 'Register');
  return json({analytics, seo});
}

export default function RegisterRoute() {
  return <Register />;
}

RegisterRoute.displayName = 'RegisterRoute';
