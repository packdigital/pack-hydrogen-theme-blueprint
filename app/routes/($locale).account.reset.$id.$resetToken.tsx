import {json} from '@shopify/remix-oxygen';
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaArgs,
} from '@shopify/remix-oxygen';
import {AnalyticsPageType, getSeoMeta} from '@shopify/hydrogen';

import {customerPasswordResetAction} from '~/lib/customer/servers/reset.server';
import {getAccountSeo} from '~/lib/utils';
import {GuestAccountLayout, ResetPassword} from '~/components';

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

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function ResetPasswordRoute() {
  return (
    <GuestAccountLayout>
      <ResetPassword />
    </GuestAccountLayout>
  );
}

ResetPasswordRoute.displayName = 'ResetPasswordRoute';
