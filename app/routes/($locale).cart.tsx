import {json} from '@shopify/remix-oxygen';
import type {LoaderFunctionArgs, MetaArgs} from '@shopify/remix-oxygen';
import {AnalyticsPageType, getSeoMeta} from '@shopify/hydrogen';

import {CartPage} from '~/components';
import {getShop, getSiteSettings} from '~/lib/utils';
import type {Page} from '~/lib/types';
import {seoPayload} from '~/lib/seo.server';

export async function loader({context, request}: LoaderFunctionArgs) {
  const shop = await getShop(context);
  const siteSettings = await getSiteSettings(context);
  const analytics = {pageType: AnalyticsPageType.cart};
  const seo = seoPayload.page({
    page: {title: 'Cart'} as Page,
    shop,
    siteSettings,
  });
  return json({analytics, seo, url: request.url});
}

export const meta = ({data}: MetaArgs) => {
  return getSeoMeta(data.seo);
};

export default function CartRoute() {
  return <CartPage />;
}

CartRoute.displayName = 'CartRoute';
