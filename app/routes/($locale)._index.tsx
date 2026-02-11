import {useLoaderData} from 'react-router';
import {AnalyticsPageType, getSeoMeta} from '@shopify/hydrogen';
import {RenderSections} from '@pack/react';

import {getPage} from '~/lib/server-utils/pack.server';
import {getShop, getSiteSettings} from '~/lib/server-utils/settings.server';
import {seoPayload} from '~/lib/server-utils/seo.server';
import {PAGE_QUERY} from '~/data/graphql/pack/page';
import {routeHeaders} from '~/data/cache';

import type {Route} from './+types/($locale)._index';

export const headers = routeHeaders;

export async function loader({context, params, request}: Route.LoaderArgs) {
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

export const meta: Route.MetaFunction = ({matches}) => {
  return (
    getSeoMeta(...matches.map((match) => (match?.loaderData as any).seo)) || []
  );
};

export default function Index() {
  const {page} = useLoaderData<typeof loader>();

  return <RenderSections content={page} />;
}
