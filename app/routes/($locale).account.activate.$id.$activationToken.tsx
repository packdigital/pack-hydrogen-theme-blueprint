import {json} from '@shopify/remix-oxygen';
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaArgs,
} from '@shopify/remix-oxygen';
import {AnalyticsPageType, getSeoMeta} from '@shopify/hydrogen';

import {Activate, GuestAccountLayout} from '~/components';
import {getAccountSeo} from '~/lib/utils';
import {customerActivateAction, redirectIfLoggedIn} from '~/lib/customer';

export async function action({request, context}: ActionFunctionArgs) {
  const {data, status} = await customerActivateAction({request, context});
  return json(data, {status});
}

export async function loader({context, params}: LoaderFunctionArgs) {
  await redirectIfLoggedIn({context, params});
  const analytics = {pageType: AnalyticsPageType.customersActivateAccount};
  const seo = await getAccountSeo(context, 'Activate');
  return json({analytics, seo});
}

export const meta = ({data}: MetaArgs) => {
  return getSeoMeta(data.seo);
};

export default function ActivateRoute() {
  return (
    <GuestAccountLayout>
      <Activate />
    </GuestAccountLayout>
  );
}

ActivateRoute.displayName = 'ActivateRoute';
