import {json, redirect} from '@shopify/remix-oxygen';
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {AnalyticsPageType} from '@shopify/hydrogen';

import {Profile} from '~/components';
import {getAccountSeo} from '~/lib/utils';
import {customerUpdateProfileAction} from '~/lib/customer';

export async function action({request, context}: ActionFunctionArgs) {
  const {data, status} = await customerUpdateProfileAction({request, context});
  if (data.customerAccessToken) {
    context.session.set('customerAccessToken', data.customerAccessToken);
    return json(data, {
      status,
      headers: {'Set-Cookie': await context.session.commit()},
    });
  }
  return json(data, {status});
}

export async function loader({context, params}: LoaderFunctionArgs) {
  const customerAccessToken = await context.session.get('customerAccessToken');
  if (!customerAccessToken) {
    return redirect(
      params.locale ? `/${params.locale}/account/login` : '/account/login',
    );
  }
  const analytics = {pageType: AnalyticsPageType.customersAccount};
  const seo = await getAccountSeo(context, 'Profile');
  return json({analytics, seo});
}

export default function ProfileRoute() {
  return <Profile />;
}

ProfileRoute.displayName = 'ProfileRoute';
