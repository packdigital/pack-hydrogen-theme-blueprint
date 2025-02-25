import {data as dataWithOptions, redirect} from '@shopify/remix-oxygen';
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaArgs,
} from '@shopify/remix-oxygen';
import {AnalyticsPageType, getSeoMeta} from '@shopify/hydrogen';

import {Activate} from '~/components/Account';
import {GuestAccountLayout} from '~/components/AccountLayout';
import {getAccountSeo} from '~/lib/utils';
import {redirectLinkIfLoggedIn} from '~/lib/customer';
import {customerActivateAction} from '~/lib/customer/servers/activate.server';

export async function action({request, context}: ActionFunctionArgs) {
  const {data, status} = await customerActivateAction({request, context});
  return dataWithOptions(data, {status});
}

export async function loader({context, params}: LoaderFunctionArgs) {
  const redirectLink = await redirectLinkIfLoggedIn({context, params});
  if (redirectLink) return redirect(redirectLink);
  const seo = await getAccountSeo(context, 'Activate');
  const analytics = {pageType: AnalyticsPageType.customersActivateAccount};
  return {analytics, seo};
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function ActivateRoute() {
  return (
    <GuestAccountLayout>
      <Activate />
    </GuestAccountLayout>
  );
}

ActivateRoute.displayName = 'ActivateRoute';
