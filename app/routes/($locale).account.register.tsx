import {json, redirect} from '@shopify/remix-oxygen';
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaArgs,
} from '@shopify/remix-oxygen';
import {AnalyticsPageType, getSeoMeta} from '@shopify/hydrogen';

import {
  customerLoginRegisterAction,
  redirectLinkIfLoggedIn,
} from '~/lib/customer';
import {getAccountSeo} from '~/lib/utils';
import {GuestAccountLayout, Register} from '~/components';

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
  const redirectLink = await redirectLinkIfLoggedIn({context, params});
  if (redirectLink) return redirect(redirectLink);
  const analytics = {pageType: AnalyticsPageType.customersRegister};
  const seo = await getAccountSeo(context, 'Register');
  return json({analytics, seo});
}

export const meta = ({data}: MetaArgs) => {
  return getSeoMeta(data.seo);
};

export default function RegisterRoute() {
  return (
    <GuestAccountLayout>
      <Register />
    </GuestAccountLayout>
  );
}

RegisterRoute.displayName = 'RegisterRoute';
