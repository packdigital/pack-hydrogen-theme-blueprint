import {json, redirect} from '@shopify/remix-oxygen';
import {AnalyticsPageType, getSeoMeta} from '@shopify/hydrogen';
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaArgs,
} from '@shopify/remix-oxygen';

import {CustomerAccountLayout, Orders} from '~/components';
import {getAccountSeo} from '~/lib/utils';
import {redirectLinkIfLoggedOut} from '~/lib/customer';
import {
  customerOrdersAction,
  customerOrdersLoader,
} from '~/lib/customer/servers/orders.server';

export async function action({request, context}: ActionFunctionArgs) {
  const {data, status} = await customerOrdersAction({request, context});
  return json(data, {status});
}

export async function loader({context, params, request}: LoaderFunctionArgs) {
  const redirectLink = await redirectLinkIfLoggedOut({context, params});
  if (redirectLink) return redirect(redirectLink);
  const {data, status} = await customerOrdersLoader({context, request});
  const analytics = {pageType: AnalyticsPageType.customersAccount};
  const seo = await getAccountSeo(context, 'Orders');
  return json({...data, analytics, seo}, {status});
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
