import {json, redirect} from '@shopify/remix-oxygen';
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaArgs,
} from '@shopify/remix-oxygen';
import {AnalyticsPageType, getSeoMeta} from '@shopify/hydrogen';

import {Activate, GuestAccountLayout} from '~/components';
import {getAccountSeo} from '~/lib/utils';
import {redirectLinkIfLoggedIn} from '~/lib/customer';
import {customerActivateAction} from '~/lib/customer/servers/activate.server';

export async function action({request, context}: ActionFunctionArgs) {
  const {data, status} = await customerActivateAction({request, context});
  return json(data, {status});
}

export async function loader({context, params}: LoaderFunctionArgs) {
  const redirectLink = await redirectLinkIfLoggedIn({context, params});
  if (redirectLink) return redirect(redirectLink);
  const analytics = {pageType: AnalyticsPageType.customersActivateAccount};
  const seo = await getAccountSeo(context, 'Activate');
  return json({analytics, seo});
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
