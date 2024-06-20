import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import type {LoaderFunctionArgs, MetaArgs} from '@shopify/remix-oxygen';
import {AnalyticsPageType, getSeoMeta} from '@shopify/hydrogen';
import {RenderSections} from '@pack/react';

import {getShop, getSiteSettings} from '~/lib/utils';
import {PAGE_QUERY} from '~/data/queries';
import {routeHeaders} from '~/data/cache';
import {seoPayload} from '~/lib/seo.server';

export const headers = routeHeaders;

export async function loader({context, params, request}: LoaderFunctionArgs) {
  const {handle} = params;
  const {data} = await context.pack.query(PAGE_QUERY, {
    variables: {handle},
    cache: context.storefront.CacheLong(),
  });

  if (!data?.page) throw new Response(null, {status: 404});

  const shop = await getShop(context);
  const siteSettings = await getSiteSettings(context);
  const isPolicy = handle?.includes('privacy') || handle?.includes('policy');
  const analytics = {
    pageType: isPolicy ? AnalyticsPageType.policy : AnalyticsPageType.page,
  };
  const seo = seoPayload.page({
    page: data.page,
    shop,
    siteSettings,
  });

  return json({
    analytics,
    page: data.page,
    seo,
    url: request.url,
  });
}

export const meta = ({data}: MetaArgs) => {
  return getSeoMeta(data.seo);
};

export default function PageRoute() {
  const {page} = useLoaderData<typeof loader>();

  return (
    <div data-comp={PageRoute.displayName}>
      <RenderSections content={page} />
    </div>
  );
}

PageRoute.displayName = 'PageRoute';
