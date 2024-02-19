import {json, redirect} from '@shopify/remix-oxygen';
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {AnalyticsPageType} from '@shopify/hydrogen';

import {customerPasswordResetAction} from '~/lib/customer';
import {getAccountSeo} from '~/lib/utils';
import {ResetPassword} from '~/components';

export async function action({request, context}: ActionFunctionArgs) {
  const {data, status} = await customerPasswordResetAction({request, context});
  const seo = await getAccountSeo(context, 'Reset Password');
  return json({...data, seo}, {status});
}

export async function loader({context}: LoaderFunctionArgs) {
  const analytics = {pageType: AnalyticsPageType.customersResetPassword};
  const seo = await getAccountSeo(context, 'Register');
  return json({analytics, seo});
}
export default function ResetPasswordRoute() {
  return <ResetPassword />;
}

ResetPasswordRoute.displayName = 'ResetPasswordRoute';
