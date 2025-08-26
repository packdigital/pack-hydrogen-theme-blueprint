import {getPaginationVariables} from '@shopify/hydrogen';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {ProductCollectionSortKeys} from '@shopify/hydrogen/storefront-api-types';

import {COLLECTION_QUERY} from '~/data/graphql/storefront/collection';
import {getSiteSettings} from '~/lib/utils';
import {routeHeaders} from '~/data/cache';
import {getFilters} from '~/lib/utils';

export const headers = routeHeaders;

export async function loader({request, context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const siteSettings = await getSiteSettings(context);
  const resultsPerPage = Math.floor(
    Number(
      siteSettings?.data?.siteSettings?.settings?.collection?.pagination
        ?.resultsPerPage,
    ) || 24,
  );

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const handle = String(searchParams.get('handle') || '');
  const sortKey = String(
    searchParams.get('sortKey')?.toUpperCase() ?? 'COLLECTION_DEFAULT',
  ) as ProductCollectionSortKeys;
  const reverse = Boolean(searchParams.get('reverse') ?? false);

  const paginationVariables = getPaginationVariables(request, {
    pageBy: resultsPerPage,
  });

  const {collection} = await storefront.query(COLLECTION_QUERY, {
    variables: {
      handle,
      sortKey,
      reverse,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
      ...paginationVariables,
    },
    cache: storefront.CacheShort(),
  });

  return Response.json({collection});
}
