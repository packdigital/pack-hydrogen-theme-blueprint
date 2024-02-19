import {json, redirect} from '@shopify/remix-oxygen';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {AnalyticsPageType} from '@shopify/hydrogen';

import {Orders} from '~/components';
import {getAccountSeo} from '~/lib/utils';
import {customerOrdersLoader} from '~/lib/customer';

export async function loader({context, params}: LoaderFunctionArgs) {
  const customerAccessToken = await context.session.get('customerAccessToken');
  if (!customerAccessToken) {
    return redirect(
      params.locale ? `/${params.locale}/account/login` : '/account/login',
    );
  }
  const {data, status} = await customerOrdersLoader({context});
  const analytics = {pageType: AnalyticsPageType.customersAccount};
  const seo = await getAccountSeo(context, 'Orders');
  return json({...data, analytics, seo}, {status});
}

export default function OrdersRoute() {
  return <Orders />;
}

OrdersRoute.displayName = 'OrdersRoute';
