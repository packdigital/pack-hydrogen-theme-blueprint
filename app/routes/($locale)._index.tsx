import {useLoaderData} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import type {LoaderFunctionArgs, MetaArgs} from '@shopify/remix-oxygen';
import {AnalyticsPageType, getSeoMeta} from '@shopify/hydrogen';
import {RenderSections} from '@pack/react';

import {getShop, getSiteSettings} from '~/lib/utils';
import {PAGE_QUERY} from '~/data/queries';
import {routeHeaders} from '~/data/cache';
import {seoPayload} from '~/lib/seo.server';

export const headers = routeHeaders;

export async function loader({context, params}: LoaderFunctionArgs) {
  const {language, country} = context.storefront.i18n;

  if (
    params.locale &&
    params.locale.toLowerCase() !== `${language}-${country}`.toLowerCase()
  ) {
    // If the locale URL param is defined, yet we still are on `EN-US`
    // the the locale param must be invalid, send to the 404 page
    throw new Response(null, {status: 404});
  }

  const {data} = await context.pack.query(PAGE_QUERY, {
    variables: {handle: '/'},
    cache: context.storefront.CacheLong(),
  });

  if (!data?.page) throw new Response(null, {status: 404});

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

export const meta = ({data}: MetaArgs) => {
  return getSeoMeta(data.seo);
};

export default function Index() {
  const {page} = useLoaderData<typeof loader>();

  return <RenderSections content={page} />;
}
