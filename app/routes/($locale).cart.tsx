import {AnalyticsPageType, getSeoMeta} from '@shopify/hydrogen';
import {Outlet} from 'react-router';

import {CartPage} from '~/components/Cart';
import {getShop, getSiteSettings} from '~/lib/server-utils/settings.server';
import {seoPayload} from '~/lib/server-utils/seo.server';
import type {Page} from '~/lib/types';

import type {Route} from './+types/($locale).cart';

export async function loader({context, request}: Route.LoaderArgs) {
  const [shop, siteSettings] = await Promise.all([
    getShop(context),
    getSiteSettings(context),
  ]);
  const analytics = {pageType: AnalyticsPageType.cart};
  const seo = seoPayload.page({
    page: {title: 'Cart'} as Page,
    shop,
    siteSettings,
  });
  return {analytics, seo, url: request.url};
}

export const meta: Route.MetaFunction = ({matches}) => {
  return (
    getSeoMeta(...matches.map((match) => (match?.loaderData as any).seo)) || []
  );
};

export default function CartRoute() {
  return (
    <>
      <Outlet />
      <CartPage />
    </>
  );
}
