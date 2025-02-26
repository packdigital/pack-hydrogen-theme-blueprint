import {data as dataWithOptions, redirect} from '@shopify/remix-oxygen';
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaArgs,
} from '@shopify/remix-oxygen';
import {AnalyticsPageType, getSeoMeta} from '@shopify/hydrogen';

import {redirectLinkIfLoggedIn} from '~/lib/customer';
import {customerLoginRegisterAction} from '~/lib/customer/servers/login-register.server';
import {getAccountSeo} from '~/lib/utils';
import {GuestAccountLayout} from '~/components/AccountLayout';
import {Register} from '~/components/Account';

export async function action({request, context}: ActionFunctionArgs) {
  const {session} = context;
  const {data, status} = await customerLoginRegisterAction({request, context});
  const customerAccessToken = data.customerAccessToken;
  if (customerAccessToken) {
    session.set('customerAccessToken', customerAccessToken);
    return data;
  }
  return dataWithOptions(data, {status});
}

export async function loader({context, params}: LoaderFunctionArgs) {
  const redirectLink = await redirectLinkIfLoggedIn({context, params});
  if (redirectLink) return redirect(redirectLink);
  const seo = await getAccountSeo(context, 'Register');
  const analytics = {pageType: AnalyticsPageType.customersRegister};
  return {analytics, seo};
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function RegisterRoute() {
  return (
    <GuestAccountLayout>
      <Register />
    </GuestAccountLayout>
  );
}

RegisterRoute.displayName = 'RegisterRoute';
