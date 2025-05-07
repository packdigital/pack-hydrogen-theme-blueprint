import {useLoaderData} from '@remix-run/react';
import type {LoaderFunctionArgs, MetaArgs} from '@shopify/remix-oxygen';
import type {SeoConfig} from '@shopify/hydrogen';
import {AnalyticsPageType, getSeoMeta} from '@shopify/hydrogen';
import {RenderSections} from '@pack/react';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

import {getShop, getSiteSettings} from '~/lib/utils';
import {PAGE_QUERY} from '~/data/graphql/pack/page';
import {routeHeaders} from '~/data/cache';
import {seoPayload} from '~/lib/seo.server';
import {getProductsMapForPage} from '~/lib/products.server';
import type {Page, ProductCms} from '~/lib/types';

export const headers = routeHeaders;

type PageLoaderData = {
  analytics: {pageType: 'page' | 'policy'};
  page: Page;
  productsMap: Record<string, Product>;
  seo: SeoConfig;
  url: string;
};

export async function loader({
  context,
  params,
  request,
}: LoaderFunctionArgs): Promise<PageLoaderData> {
  const {handle} = params;

  if (!handle)
    throw new Response(null, {
      status: 400,
      statusText: 'Missing page `handle` parameter',
    });

  const getPageWithAllSections = async ({
    accumulatedPage,
    cursor,
  }: {
    accumulatedPage: Page | null;
    cursor: string | null;
  }): Promise<Page> => {
    const {data} = await context.pack.query(PAGE_QUERY, {
      variables: {handle, cursor},
      cache: context.storefront.CacheLong(),
    });

    if (!data?.page) throw new Response(null, {status: 404});

    const queriedPage = data.page;
    const {nodes = [], pageInfo} = queriedPage.sections ?? {};

    const mergedSections = {
      nodes: [...(accumulatedPage?.sections?.nodes || []), ...nodes],
      pageInfo,
    };

    const combinedPage = {
      ...queriedPage,
      sections: mergedSections,
    };

    if (pageInfo?.hasNextPage) {
      return getPageWithAllSections({
        accumulatedPage: combinedPage,
        cursor: pageInfo.endCursor,
      });
    }

    return combinedPage;
  };

  const [page, shop, siteSettings] = await Promise.all([
    getPageWithAllSections({accumulatedPage: null, cursor: null}),
    getShop(context),
    getSiteSettings(context),
  ]);

  const productsMap = await getProductsMapForPage({
    context,
    page,
  });

  const isPolicy = handle?.includes('privacy') || handle?.includes('policy');
  const analytics = {
    pageType: isPolicy ? AnalyticsPageType.policy : AnalyticsPageType.page,
  };

  const seo = seoPayload.page({
    page,
    shop,
    siteSettings,
  });

  return {
    analytics,
    page,
    productsMap,
    seo,
    url: request.url,
  };
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
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
