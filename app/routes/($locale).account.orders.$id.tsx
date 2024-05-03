import {json, redirect} from '@shopify/remix-oxygen';
import type {LoaderFunctionArgs, MetaArgs} from '@shopify/remix-oxygen';
import {AnalyticsPageType, getSeoMeta} from '@shopify/hydrogen';

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

export const meta = ({data}: MetaArgs) => {
  return getSeoMeta(data.seo);
};

export default function OrderRoute() {
  return <Order />;
}

OrderRoute.displayName = 'OrderRoute';
