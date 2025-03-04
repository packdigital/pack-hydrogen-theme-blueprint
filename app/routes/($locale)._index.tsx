import {useLoaderData} from '@remix-run/react';
import {AnalyticsPageType, getSeoMeta} from '@shopify/hydrogen';
import {RenderSections} from '@pack/react';
import type {LoaderFunctionArgs, MetaArgs} from '@shopify/remix-oxygen';

import {getShop, getSiteSettings} from '~/lib/utils';
import {PAGE_QUERY} from '~/data/graphql/pack/page';
import {routeHeaders} from '~/data/cache';
import {seoPayload} from '~/lib/seo.server';

export const headers = routeHeaders;

export async function loader({context, params, request}: LoaderFunctionArgs) {
  const {storefront, pack} = context;
  const {language, country} = storefront.i18n;

  if (
    params.locale &&
    params.locale.toLowerCase() !== `${language}-${country}`.toLowerCase()
  ) {
    // If the locale URL param is defined, yet we still are on `EN-US`
    // the the locale param must be invalid, send to the 404 page
    throw new Response(null, {status: 404});
  }

  const [{data}, shop, siteSettings] = await Promise.all([
    pack.query(PAGE_QUERY, {
      variables: {handle: '/'},
      cache: storefront.CacheLong(),
    }),
    getShop(context),
    getSiteSettings(context),
  ]);

  if (!data?.page) throw new Response(null, {status: 404});

  const analytics = {pageType: AnalyticsPageType.home};
  const seo = seoPayload.home({
    page: data.page,
    shop,
    siteSettings,
  });

  return {
    analytics,
    page: data.page,
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
