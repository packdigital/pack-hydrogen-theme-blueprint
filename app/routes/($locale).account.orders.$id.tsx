import {data as dataWithOptions, redirect} from '@shopify/remix-oxygen';
import {AnalyticsPageType, getSeoMeta} from '@shopify/hydrogen';
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaArgs,
} from '@shopify/remix-oxygen';

import {CustomerAccountLayout} from '~/components/AccountLayout';
import {Order} from '~/components/Account';
import {getAccountSeo} from '~/lib/utils';
import {redirectLinkIfLoggedOut} from '~/lib/customer';
import {
  customerOrderAction,
  customerOrderLoader,
} from '~/lib/customer/servers/order.server';

export async function action({request, context, params}: ActionFunctionArgs) {
  const {data, status} = await customerOrderAction({request, context, params});
  return dataWithOptions(data, {status});
}

export async function loader({request, context, params}: LoaderFunctionArgs) {
  const redirectLink = await redirectLinkIfLoggedOut({context, params});
  if (redirectLink) return redirect(redirectLink);
  const [{data, status}, seo] = await Promise.all([
    customerOrderLoader({request, context, params}),
    getAccountSeo(context, 'Order'),
  ]);
  const analytics = {pageType: AnalyticsPageType.customersOrder};
  return dataWithOptions({...data, analytics, seo}, {status});
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function OrderRoute() {
  return (
    <CustomerAccountLayout>
      <Order />
    </CustomerAccountLayout>
  );
}

OrderRoute.displayName = 'OrderRoute';
