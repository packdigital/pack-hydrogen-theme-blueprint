import {useLoaderData} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {AnalyticsPageType} from '@shopify/hydrogen';
import {RenderSections} from '@pack/react';

import {getShop, getSiteSettings} from '~/lib/utils';
import {HOME_PAGE_QUERY} from '~/data/queries';
import {routeHeaders} from '~/data/cache';
import {seoPayload} from '~/lib/seo.server';

export const headers = routeHeaders;

export async function loader({context}: LoaderFunctionArgs) {
  const {data} = await context.pack.query(HOME_PAGE_QUERY, {
    cache: context.storefront.CacheShort(),
  });

  if (!data.page) throw new Response(null, {status: 404});

  const shop = await getShop(context);
  const siteSettings = await getSiteSettings(context);
  const analytics = {pageType: AnalyticsPageType.home};
  const seo = seoPayload.home({
    page: data.page,
    shop,
    siteSettings,
  });

  return json({
    analytics,
    page: data.page,
    seo,
  });
}

export default function Index() {
  const {page} = useLoaderData<typeof loader>();

  return <RenderSections content={page} />;
}
