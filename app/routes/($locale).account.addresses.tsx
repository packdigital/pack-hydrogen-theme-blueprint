import {data as dataWithOptions, redirect} from '@shopify/remix-oxygen';
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaArgs,
} from '@shopify/remix-oxygen';
import {AnalyticsPageType, getSeoMeta} from '@shopify/hydrogen';

import {redirectLinkIfLoggedOut} from '~/lib/customer';
import {
  customerAddressesAction,
  customerAddressesLoader,
} from '~/lib/customer/servers/addresses.server';
import {getAccountSeo} from '~/lib/utils';
import {CustomerAccountLayout} from '~/components/AccountLayout';
import {Addresses} from '~/components/Account';

export async function action({request, context}: ActionFunctionArgs) {
  const {data, status} = await customerAddressesAction({request, context});
  return dataWithOptions(data, {status});
}

export async function loader({context, params}: LoaderFunctionArgs) {
  const redirectLink = await redirectLinkIfLoggedOut({context, params});
  if (redirectLink) return redirect(redirectLink);
  const [{data, status}, seo] = await Promise.all([
    customerAddressesLoader({context}),
    getAccountSeo(context, 'Addresses'),
  ]);
  const analytics = {pageType: AnalyticsPageType.customersAddresses};
  return dataWithOptions({...data, analytics, seo}, {status});
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
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
