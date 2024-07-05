import {json} from '@shopify/remix-oxygen';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {
  PredictiveSearchResult,
  PredictiveSearchType,
  SearchQuerySuggestion,
} from '@shopify/hydrogen/storefront-api-types';

import {PREDICTIVE_SEARCH_QUERY} from '~/data/queries';
import {getSiteSettings} from '~/lib/utils';

type PredictiveCollection = PredictiveSearchResult['collections'][number];
type PredicticeSearchResultItemImage = PredictiveCollection['image'];
type NormalizedPredictiveSearch = {
  results: NormalizedPredictiveSearchResults | null;
  totalResults: number;
};
type NormalizedPredictiveSearchResultItem = {
  __typename: string | undefined;
  handle: string;
  id: string;
  image?: PredicticeSearchResultItemImage;
  styledTitle?: string;
  title: string;
  url: string;
};
type NormalizedPredictiveSearchResults = Array<
  | {type: 'queries'; items: Array<NormalizedPredictiveSearchResultItem>}
  | {type: 'collections'; items: Array<NormalizedPredictiveSearchResultItem>}
>;
const DEFAULT_SEARCH_TYPES: PredictiveSearchType[] = ['COLLECTION', 'QUERY'];

export async function loader({request, params, context}: LoaderFunctionArgs) {
  const search = await fetchPredictiveSearchResults({
    params,
    request,
    context,
  });
  return json(search);
}

async function fetchPredictiveSearchResults({
  params,
  request,
  context,
}: Pick<LoaderFunctionArgs, 'params' | 'context' | 'request'>) {
  const {storefront} = context;
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const searchTerm = String(searchParams.get('q') || '');
  const limit = Number(searchParams.get('limit')) || 10;
  const rawTypes = String(searchParams.get('type') || 'ANY');
  const searchTypes =
    rawTypes === 'ANY'
      ? DEFAULT_SEARCH_TYPES
      : rawTypes
          .split(',')
          .map((t) => t.toUpperCase() as PredictiveSearchType)
          .filter((t) => DEFAULT_SEARCH_TYPES.includes(t));

  const siteSettings = await getSiteSettings(context);
  const characterMin = Number(
    siteSettings?.data?.siteSettings?.settings?.search?.input?.characterMin ||
      1,
  );

  if (!searchTerm || searchTerm.length < characterMin) {
    return {
      searchResults: {results: null, totalResults: 0},
      searchTerm,
      searchTypes,
    };
  }

  const data = await storefront.query(PREDICTIVE_SEARCH_QUERY, {
    variables: {
      limit,
      limitScope: 'EACH',
      searchTerm,
      types: searchTypes,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
    cache: storefront.CacheShort(),
  });

  if (!data) {
    throw new Error('No data returned from Shopify API');
  }

  const searchResults = normalizePredictiveSearchResults(
    data.predictiveSearch,
    params.locale,
  );

  return {searchResults, searchTerm, searchTypes};
}

/**
 * Normalize results and apply tracking qurery parameters to each result url
 */
export function normalizePredictiveSearchResults(
  predictiveSearch: PredictiveSearchResult,
  locale: LoaderFunctionArgs['params']['locale'],
): NormalizedPredictiveSearch {
  let totalResults = 0;
  if (!predictiveSearch) {
    return {
      results: null,
      totalResults,
    };
  }

  const localePrefix = locale ? `/${locale}` : '';
  const results: NormalizedPredictiveSearchResults = [];

  if (predictiveSearch.queries.length) {
    results.push({
      type: 'queries',
      items: predictiveSearch.queries.map((query: SearchQuerySuggestion) => {
        totalResults++;
        return {
          __typename: query.__typename,
          handle: '',
          id: query.text,
          image: undefined,
          title: query.text,
          styledTitle: query.styledText,
          url: `${localePrefix}/search`,
        };
      }),
    });
  }

  if (predictiveSearch.collections.length) {
    results.push({
      type: 'collections',
      items: predictiveSearch.collections.map(
        (collection: PredictiveCollection) => {
          totalResults++;
          return {
            __typename: collection.__typename,
            handle: collection.handle,
            id: collection.id,
            image: collection.image,
            title: collection.title,
            url: `${localePrefix}/collections/${collection.handle}`,
          };
        },
      ),
    });
  }

  return {results, totalResults};
}
