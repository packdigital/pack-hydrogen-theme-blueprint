import {json, redirect} from '@shopify/remix-oxygen';
import {AnalyticsPageType, getSeoMeta} from '@shopify/hydrogen';
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaArgs,
} from '@shopify/remix-oxygen';

import {CustomerAccountLayout, Order} from '~/components';
import {getAccountSeo} from '~/lib/utils';
import {
  customerOrderAction,
  customerOrderLoader,
  redirectLinkIfLoggedOut,
} from '~/lib/customer';

export async function action({request, context, params}: ActionFunctionArgs) {
  const {data, status} = await customerOrderAction({request, context, params});
  return json(data, {status});
}

export async function loader({request, context, params}: LoaderFunctionArgs) {
  const redirectLink = await redirectLinkIfLoggedOut({context, params});
  if (redirectLink) return redirect(redirectLink);
  const {data, status} = await customerOrderLoader({request, context, params});
  const analytics = {pageType: AnalyticsPageType.customersOrder};
  const seo = await getAccountSeo(context, 'Order');
  return json({...data, analytics, seo}, {status});
}

export const meta = ({data}: MetaArgs) => {
  return getSeoMeta(data.seo);
};

export default function OrderRoute() {
  return (
    <CustomerAccountLayout>
      <Order />
    </CustomerAccountLayout>
  );
}

OrderRoute.displayName = 'OrderRoute';
