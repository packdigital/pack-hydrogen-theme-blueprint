import {json, redirect} from '@shopify/remix-oxygen';
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaArgs,
} from '@shopify/remix-oxygen';
import {AnalyticsPageType, getSeoMeta} from '@shopify/hydrogen';

import {CustomerAccountLayout, Profile} from '~/components';
import {getAccountSeo} from '~/lib/utils';
import {
  customerUpdateProfileAction,
  redirectLinkIfLoggedOut,
} from '~/lib/customer';

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
  const redirectLink = await redirectLinkIfLoggedOut({context, params});
  if (redirectLink) return redirect(redirectLink);
  const analytics = {pageType: AnalyticsPageType.customersAccount};
  const seo = await getAccountSeo(context, 'Profile');
  return json({analytics, seo});
}

export const meta = ({data}: MetaArgs) => {
  return getSeoMeta(data.seo);
};

export default function ProfileRoute() {
  return (
    <CustomerAccountLayout>
      <Profile />
    </CustomerAccountLayout>
  );
}

ProfileRoute.displayName = 'ProfileRoute';
