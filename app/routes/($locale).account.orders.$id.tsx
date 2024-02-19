import {json, redirect} from '@shopify/remix-oxygen';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {AnalyticsPageType} from '@shopify/hydrogen';

import {Order} from '~/components';
import {getAccountSeo} from '~/lib/utils';
import {customerOrderLoader} from '~/lib/customer';

export async function loader({request, context, params}: LoaderFunctionArgs) {
  const customerAccessToken = await context.session.get('customerAccessToken');
  if (!customerAccessToken || !params.id) {
    return redirect(
      params.locale ? `/${params.locale}/account/login` : '/account/login',
    );
  }
  const {data, status} = await customerOrderLoader({request, context, params});
  const analytics = {pageType: AnalyticsPageType.customersOrder};
  const seo = await getAccountSeo(context, 'Order');
  return json({...data, analytics, seo}, {status});
}

export default function OrderRoute() {
  return <Order />;
}

OrderRoute.displayName = 'OrderRoute';
