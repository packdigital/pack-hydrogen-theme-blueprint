import {AnalyticsPageType, getSeoMeta} from '@shopify/hydrogen';
import type {LoaderFunctionArgs, MetaArgs} from '@shopify/remix-oxygen';

import {getAccountSeo} from '~/lib/server-utils/seo.server';
import {CustomerAccountLayout} from '~/components/AccountLayout/CustomerAccountLayout';
import {Orders} from '~/components/Account/Orders/Orders';

export async function loader({context}: LoaderFunctionArgs) {
  const analytics = {pageType: AnalyticsPageType.customersAccount};
  const seo = await getAccountSeo(context, 'Orders');
  return {analytics, seo};
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function OrdersRoute() {
  return (
    <CustomerAccountLayout>
      <Orders />
    </CustomerAccountLayout>
  );
}

OrdersRoute.displayName = 'OrdersRoute';
