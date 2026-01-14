import {data as dataWithOptions} from 'react-router';
import {AnalyticsPageType, getSeoMeta} from '@shopify/hydrogen';

import {getAccountSeo} from '~/lib/server-utils/seo.server';
import {CustomerAccountLayout} from '~/components/AccountLayout/CustomerAccountLayout';
import {Profile} from '~/components/Account/Profile';
import {customerUpdateProfileAction} from '~/lib/customer/profile.server';

import type {Route} from './+types/($locale).account.profile';

export async function action({request, context}: Route.ActionArgs) {
  // Double-check current user is logged in
  if (!(await context.customerAccount.isLoggedIn())) {
    return context.customerAccount.logout();
  }
  const {data, status} = await customerUpdateProfileAction({request, context});
  return dataWithOptions(data, {status});
}

export async function loader({context}: Route.LoaderArgs) {
  const analytics = {pageType: AnalyticsPageType.customersAccount};
  const seo = await getAccountSeo(context, 'Profile');
  return {analytics, seo};
}

export const meta = ({matches}: Route.MetaArgs) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function ProfileRoute() {
  return (
    <CustomerAccountLayout>
      <Profile />
    </CustomerAccountLayout>
  );
}

ProfileRoute.displayName = 'ProfileRoute';
