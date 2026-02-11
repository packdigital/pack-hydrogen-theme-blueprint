import {AnalyticsPageType, getSeoMeta} from '@shopify/hydrogen';

import {getAccountSeo} from '~/lib/server-utils/seo.server';
import {CustomerAccountLayout} from '~/components/AccountLayout/CustomerAccountLayout';
import {Orders} from '~/components/Account/Orders/Orders';

import type {Route} from './+types/($locale).account.orders._index';

export async function loader({context}: Route.LoaderArgs) {
  const analytics = {pageType: AnalyticsPageType.customersAccount};
  const seo = await getAccountSeo(context, 'Orders');
  return {analytics, seo};
}

export const meta: Route.MetaFunction = ({matches}) => {
  return (
    getSeoMeta(...matches.map((match) => (match?.loaderData as any).seo)) || []
  );
};

export default function OrdersRoute() {
  return (
    <CustomerAccountLayout>
      <Orders />
    </CustomerAccountLayout>
  );
}
