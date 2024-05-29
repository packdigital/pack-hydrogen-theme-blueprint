import {json} from '@shopify/remix-oxygen';
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaArgs,
} from '@shopify/remix-oxygen';
import {AnalyticsPageType, getSeoMeta} from '@shopify/hydrogen';

import {CustomerAccountLayout, Profile} from '~/components';
import {getAccountSeo} from '~/lib/utils';
import {customerUpdateProfileAction, redirectIfLoggedOut} from '~/lib/customer';

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
  await redirectIfLoggedOut({context, params});
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
