import {json, redirect} from '@shopify/remix-oxygen';
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {AnalyticsPageType} from '@shopify/hydrogen';

import {customerAddressesAction, customerAddressesLoader} from '~/lib/customer';
import {getAccountSeo} from '~/lib/utils';
import {Addresses} from '~/components';

export async function action({request, context}: ActionFunctionArgs) {
  const {data, status} = await customerAddressesAction({request, context});
  return json(data, {status});
}

export async function loader({context, params}: LoaderFunctionArgs) {
  const customerAccessToken = await context.session.get('customerAccessToken');
  if (!customerAccessToken) {
    return redirect(
      params.locale ? `/${params.locale}/account/login` : '/account/login',
    );
  }
  const {data, status} = await customerAddressesLoader({context});
  const analytics = {pageType: AnalyticsPageType.customersAddresses};
  const seo = await getAccountSeo(context, 'Addresses');
  return json({...data, analytics, seo}, {status});
}

export default function AddressesRoute() {
  return <Addresses />;
}

AddressesRoute.displayName = 'AddressesRoute';
