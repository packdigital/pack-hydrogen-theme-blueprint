import {useLoaderData} from '@remix-run/react';
import type {LoaderFunctionArgs, MetaArgs} from '@shopify/remix-oxygen';
import {
  Analytics,
  AnalyticsPageType,
  getPaginationVariables,
  getSeoMeta,
} from '@shopify/hydrogen';
import type {
  Collection as CollectionType,
  SearchSortKeys,
} from '@shopify/hydrogen/storefront-api-types';

import {Collection} from '~/components/Collection';
import {PRODUCTS_SEARCH_QUERY} from '~/data/graphql/storefront/search';
import {getFilters, getShop, getSiteSettings} from '~/lib/utils';
import {seoPayload} from '~/lib/seo.server';
import {useGlobal} from '~/hooks';
import type {Page} from '~/lib/types';
import type {ActiveFilterValue} from '~/components/Collection/CollectionFilters/CollectionFilters.types';

export async function loader({request, context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const siteSettings = await getSiteSettings(context);
  const resultsPerPage = parseInt(
    String(
      siteSettings?.data?.siteSettings?.settings?.collection?.pagination
        ?.resultsPerPage || '24',
    ),
    10,
  );
  const searchParams = new URL(request.url).searchParams;
  const searchTerm = String(searchParams.get('q') ?? '');

  const {activeFilterValues, filters} = await getFilters({
    searchParams,
    searchTerm,
    siteSettings,
    storefront,
  });

  const sortKey = String(
    searchParams.get('sortKey')?.toUpperCase() ?? 'RELEVANCE',
  ) as SearchSortKeys;
  const reverse = Boolean(searchParams.get('reverse') ?? false);

  const paginationVariables = getPaginationVariables(request, {
    pageBy: resultsPerPage,
  });

  const [{search}, shop] = await Promise.all([
    storefront.query(PRODUCTS_SEARCH_QUERY, {
      variables: {
        searchTerm,
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

  const productsLength = search.nodes.length;

  const collection = {
    id: 'search',
    title: productsLength
      ? `Found ${search.totalCount} ${filters.length ? 'filtered ' : ''}${
          search.totalCount === 1 ? 'result' : 'results'
        } for "${searchTerm}"`
      : filters.length
      ? `Found 0 filtered results for "${searchTerm}"`
      : `Found no results for "${searchTerm}"`,
    handle: 'search',
    descriptionHtml: 'Search results',
    description: 'Search results',
    seo: {
      title: 'Search',
      description: `Search results for "${searchTerm}"`,
    },
    metafields: [],
    products: search,
    updatedAt: new Date().toISOString(),
    searchTerm,
  } as CollectionType & {searchTerm: string};

  const analytics = {pageType: AnalyticsPageType.search};
  const seo = seoPayload.search({
    search: collection,
    page: {} as Page,
    shop,
    siteSettings,
    url: request.url,
  });

  return {
    activeFilterValues,
    analytics,
    collection,
    searchTerm,
    seo,
    url: request.url,
  };
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function SearchRoute() {
  const {activeFilterValues, collection, searchTerm} =
    useLoaderData<typeof loader>();
  const {isCartReady} = useGlobal();

  return (
    <section data-comp="search-page" className="[&_h1]:text-h3">
      <Collection
        activeFilterValues={activeFilterValues as ActiveFilterValue[]}
        collection={collection}
        searchTerm={searchTerm}
        showHeading
        title={collection.title}
      />

      {isCartReady && (
        <Analytics.SearchView
          data={{
            searchTerm,
            searchResults: collection.products.nodes,
          }}
        />
      )}
    </section>
  );
}

SearchRoute.displayName = 'SearchRoute';
