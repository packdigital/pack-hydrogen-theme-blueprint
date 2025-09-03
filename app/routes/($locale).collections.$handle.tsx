import {useMemo} from 'react';
import {useLoaderData} from '@remix-run/react';
import {
  Analytics,
  AnalyticsPageType,
  getPaginationVariables,
  getSeoMeta,
  storefrontRedirect,
} from '@shopify/hydrogen';
import {RenderSections} from '@pack/react';
import type {LoaderFunctionArgs, MetaArgs} from '@shopify/remix-oxygen';
import type {
  Collection as CollectionType,
  ProductCollectionSortKeys,
} from '@shopify/hydrogen/storefront-api-types';

import {Collection} from '~/components/Collection';
import {COLLECTION_QUERY} from '~/data/graphql/storefront/collection';
import {COLLECTION_PAGE_QUERY} from '~/data/graphql/pack/collection-page';
import {getPage} from '~/lib/server-utils/pack.server';
import {getShop, getSiteSettings} from '~/lib/server-utils/settings.server';
import {getFilters} from '~/lib/server-utils/collection.server';
import {seoPayload} from '~/lib/server-utils/seo.server';
import {routeHeaders} from '~/data/cache';
import {useGlobal} from '~/hooks';
import type {Page} from '~/lib/types';
import type {ActiveFilterValue} from '~/components/Collection/CollectionFilters/CollectionFilters.types';

export const headers = routeHeaders;

export async function loader({params, context, request}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) throw new Response(null, {status: 404});

  const searchParams = new URL(request.url).searchParams;
  const siteSettings = await getSiteSettings(context);

  const {activeFilterValues, filters} = await getFilters({
    handle,
    searchParams,
    siteSettings,
    storefront,
  });

  const sortKey = String(
    searchParams.get('sortKey')?.toUpperCase() ?? 'COLLECTION_DEFAULT',
  ) as ProductCollectionSortKeys;
  const reverse = Boolean(searchParams.get('reverse') ?? false);

  const resultsPerPage = Math.floor(
    Number(
      siteSettings?.data?.siteSettings?.settings?.collection?.pagination
        ?.resultsPerPage,
    ) || 24,
  );

  const paginationVariables = getPaginationVariables(request, {
    pageBy: resultsPerPage,
  });

  const [{collectionPage}, {collection}, shop] = await Promise.all([
    getPage({
      context,
      handle,
      pageKey: 'collectionPage',
      query: COLLECTION_PAGE_QUERY,
    }),
    storefront.query(COLLECTION_QUERY, {
      variables: {
        handle,
        sortKey,
        reverse,
        filters,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
        ...paginationVariables,
      },
      cache: storefront.CacheShort(),
    }),
    getShop(context),
  ]);

  if (!collection) {
    const redirect = await storefrontRedirect({request, storefront});
    if (redirect.status === 301) return redirect;
    throw new Response(null, {status: 404});
  }

  const analytics = {
    pageType: AnalyticsPageType.collection,
    collectionHandle: handle,
    resourceId: collection.id,
  };
  const seo = seoPayload.collection({
    collection,
    page: collectionPage,
    shop,
    siteSettings,
    url: request.url,
  });

  return {
    activeFilterValues,
    analytics,
    collection,
    collectionPage,
    seo,
    url: request.url,
  };
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function CollectionRoute() {
  const {activeFilterValues, collection, collectionPage} = useLoaderData<{
    activeFilterValues: ActiveFilterValue[];
    collection: CollectionType;
    collectionPage?: Page;
  }>();
  const {isCartReady} = useGlobal();

  // determines if default collection heading should be shown
  // logic will apply once the hero section is saved and page is refreshed
  const hasVisibleHeroSection = useMemo(() => {
    if (!collectionPage) return false;
    const HERO_KEYS = ['hero', 'banner'];
    return collectionPage.sections.nodes.some(({data}: any) => {
      return HERO_KEYS.includes(data?._template);
    });
  }, [collectionPage]);

  return (
    <div data-comp={CollectionRoute.displayName}>
      {collectionPage && <RenderSections content={collectionPage} />}

      <section data-comp="collection">
        <Collection
          activeFilterValues={activeFilterValues as ActiveFilterValue[]}
          collection={collection}
          showHeading={!hasVisibleHeroSection}
          title={collectionPage?.title}
        />
      </section>

      {isCartReady && (
        <Analytics.CollectionView
          data={{
            collection: {
              id: collection.id,
              handle: collection.handle,
            },
          }}
          customData={{collection}}
        />
      )}
    </div>
  );
}

CollectionRoute.displayName = 'CollectionRoute';
