import {useLoaderData} from '@remix-run/react';
import {AnalyticsPageType, getSeoMeta} from '@shopify/hydrogen';
import {RenderSections} from '@pack/react';
import type {LoaderFunctionArgs, MetaArgs} from '@shopify/remix-oxygen';

import {getPage} from '~/lib/server-utils/pack.server';
import {getShop, getSiteSettings} from '~/lib/server-utils/settings.server';
import {seoPayload} from '~/lib/server-utils/seo.server';
import {PAGE_QUERY} from '~/data/graphql/pack/page';
import {routeHeaders} from '~/data/cache';

export const headers = routeHeaders;

export async function loader({context, params, request}: LoaderFunctionArgs) {
  const {storefront} = context;
  const {language, country} = storefront.i18n;

  if (
    params.locale &&
    params.locale.toLowerCase() !== `${language}-${country}`.toLowerCase()
  ) {
    // If the locale URL param is defined, yet we still are on `EN-US`
    // the the locale param must be invalid, send to the 404 page
    throw new Response(null, {status: 404});
  }

  const [{page}, shop, siteSettings] = await Promise.all([
    getPage({
      context,
      handle: '/',
      pageKey: 'page',
      query: PAGE_QUERY,
    }),
    getShop(context),
    getSiteSettings(context),
  ]);

  if (!page) throw new Response(null, {status: 404});

  const analytics = {pageType: AnalyticsPageType.home};
  const seo = seoPayload.home({
    page,
    shop,
    siteSettings,
  });

  return {
    analytics,
    page,
    seo,
    url: request.url,
  };
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function Index() {
  const {page} = useLoaderData<typeof loader>();

  return <RenderSections content={page} />;
}
