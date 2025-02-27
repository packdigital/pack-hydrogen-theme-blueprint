import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {PRODUCTS_SEARCH_QUERY} from '~/data/graphql/storefront/search';
import {getSiteSettings} from '~/lib/utils';

export async function loader({request, context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const searchParams = new URL(request.url).searchParams;

  const searchTerm = String(searchParams.get('q') || '');

  const siteSettings = await getSiteSettings(context);
  const characterMin = Number(
    siteSettings?.data?.siteSettings?.settings?.search?.input?.characterMin ||
      1,
  );

  if (!searchTerm || searchTerm.length < characterMin)
    return {
      searchResults: {results: null, totalResults: 0},
      searchTerm,
      searchTypes: ['PRODUCT'],
    };

  const count = Number(searchParams.get('count')) || 10;

  const {search} = await storefront.query(PRODUCTS_SEARCH_QUERY, {
    variables: {
      searchTerm,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
      first: count,
    },
    cache: storefront.CacheShort(),
  });

  return {
    searchResults: {
      results: search.nodes || null,
      totalResults: search.totalCount ?? 0,
    },
    searchTerm,
    searchTypes: ['PRODUCT'],
  };
}
