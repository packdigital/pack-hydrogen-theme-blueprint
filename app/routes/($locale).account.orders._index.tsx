import {AnalyticsPageType} from '@shopify/hydrogen';

import {getRouteSeoMeta} from '~/lib/utils';
import {getAccountSeo} from '~/lib/server-utils/seo.server';
import {CustomerAccountLayout} from '~/components/AccountLayout/CustomerAccountLayout';
import {Orders} from '~/components/Account/Orders/Orders';

import type {Route} from './+types/($locale).account.orders._index';

export async function loader({context}: Route.LoaderArgs) {
  const analytics = {pageType: AnalyticsPageType.customersAccount};
  const seo = await getAccountSeo(context, 'Orders');
  return {analytics, seo};
}

export const meta: Route.MetaFunction = ({matches, error}) => {
  return getRouteSeoMeta({matches, error});
};

export default function OrdersRoute() {
  return (
    <CustomerAccountLayout>
      <Orders />
    </CustomerAccountLayout>
  );
}
