import {data as dataWithOptions} from 'react-router';
import {AnalyticsPageType, getSeoMeta} from '@shopify/hydrogen';

import {customerAddressesAction} from '~/lib/customer/addresses.server';
import {getAccountSeo} from '~/lib/server-utils/seo.server';
import {CustomerAccountLayout} from '~/components/AccountLayout/CustomerAccountLayout';
import {Addresses} from '~/components/Account/Addresses/Addresses';

import type {Route} from './+types/($locale).account.addresses';

export async function action({request, context}: Route.ActionArgs) {
  // Double-check current user is logged in
  if (!(await context.customerAccount.isLoggedIn())) {
    return context.customerAccount.logout();
  }
  const {data, status} = await customerAddressesAction({request, context});
  return dataWithOptions(data, {status});
}

export async function loader({context}: Route.LoaderArgs) {
  const analytics = {pageType: AnalyticsPageType.customersAddresses};
  const seo = await getAccountSeo(context, 'Addresses');
  return {analytics, seo};
}

export const meta = ({matches}: Route.MetaArgs) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function AddressesRoute() {
  return (
    <CustomerAccountLayout>
      <Addresses />
    </CustomerAccountLayout>
  );
}

AddressesRoute.displayName = 'AddressesRoute';
