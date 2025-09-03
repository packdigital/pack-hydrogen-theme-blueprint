import {useLoaderData} from '@remix-run/react';
import {
  Analytics,
  AnalyticsPageType,
  getPaginationVariables,
  getSeoMeta,
} from '@shopify/hydrogen';
import type {LoaderFunctionArgs, MetaArgs} from '@shopify/remix-oxygen';
import type {
  Collection as CollectionType,
  ProductConnection,
  SearchSortKeys,
} from '@shopify/hydrogen/storefront-api-types';

import {Collection} from '~/components/Collection';
import {PRODUCTS_SEARCH_QUERY} from '~/data/graphql/storefront/search';
import {getFilters} from '~/lib/server-utils/collection.server';
import {getShop, getSiteSettings} from '~/lib/server-utils/settings.server';
import {seoPayload} from '~/lib/server-utils/seo.server';
import {useGlobal} from '~/hooks';
import type {Page} from '~/lib/types';
import type {ActiveFilterValue} from '~/components/Collection/CollectionFilters/CollectionFilters.types';

export async function loader({request, context}: LoaderFunctionArgs) {
  const {storefront} = context;

  const [siteSettings, shop] = await Promise.all([
    getSiteSettings(context),
    getShop(context),
  ]);
  const resultsPerPage = parseInt(
    String(
      siteSettings?.data?.siteSettings?.settings?.collection?.pagination
        ?.resultsPerPage || '24',
    ),
    10,
  );
  const searchParams = new URL(request.url).searchParams;
  const searchTerm = String(searchParams.get('q') ?? '');
  const characterMin = Number(
    siteSettings?.data?.siteSettings?.settings?.search?.input?.characterMin ||
      1,
  );

  let products = {
    nodes: [],
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      endCursor: null,
      startCursor: null,
    } as ProductConnection['pageInfo'],
    filters: [],
    edges: [],
  } as ProductConnection;
  let totalCount = 0;
  let productsLength = 0;
  let activeFilterValues: ActiveFilterValue[] = [];
  let filters = [];

  if (searchTerm && searchTerm.length >= characterMin) {
    const filtersData = await getFilters({
      searchParams,
      searchTerm,
      siteSettings,
      storefront,
    });

    filters = filtersData.filters;
    activeFilterValues = filtersData.activeFilterValues;

    const sortKey = String(
      searchParams.get('sortKey')?.toUpperCase() ?? 'RELEVANCE',
    ) as SearchSortKeys;
    const reverse = Boolean(searchParams.get('reverse') ?? false);

    const paginationVariables = getPaginationVariables(request, {
      pageBy: resultsPerPage,
    });

    const {search} = await storefront.query(PRODUCTS_SEARCH_QUERY, {
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
    });

    totalCount = search.totalCount ?? 0;
    products = search;
    productsLength = search.nodes.length;
  }

  const collection = {
    id: 'search',
    title: productsLength
      ? `Found ${totalCount} ${filters.length ? 'filtered ' : ''}${
          totalCount === 1 ? 'result' : 'results'
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
    products,
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
        collection={collection as CollectionType}
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
