import type {LoaderFunctionArgs, MetaArgs} from '@shopify/remix-oxygen';
import {AnalyticsPageType, getSeoMeta} from '@shopify/hydrogen';

import {CartPage} from '~/components/Cart';
import {getShop, getSiteSettings} from '~/lib/utils';
import {seoPayload} from '~/lib/seo.server';
import type {Page} from '~/lib/types';

export async function loader({context, request}: LoaderFunctionArgs) {
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

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function CartRoute() {
  return <CartPage />;
}

CartRoute.displayName = 'CartRoute';
