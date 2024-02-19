import {json, redirect} from '@shopify/remix-oxygen';
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {AnalyticsPageType} from '@shopify/hydrogen';

import {Activate} from '~/components';
import {getAccountSeo} from '~/lib/utils';
import {customerActivateAction} from '~/lib/customer';

export async function action({request, context}: ActionFunctionArgs) {
  const {data, status} = await customerActivateAction({request, context});
  return json(data, {status});
}

export async function loader({context, params}: LoaderFunctionArgs) {
  const customerAccessToken = await context.session.get('customerAccessToken');
  if (customerAccessToken) {
    return redirect(
      params.locale ? `/${params.locale}/account/orders` : '/account/orders',
    );
  }
  const analytics = {pageType: AnalyticsPageType.customersActivateAccount};
  const seo = await getAccountSeo(context, 'Activate');
  return json({analytics, seo});
}

export default function ActivateRoute() {
  return <Activate />;
}

ActivateRoute.displayName = 'ActivateRoute';
