import {json} from '@shopify/remix-oxygen';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getPaginationVariables} from '@shopify/hydrogen';
import type {ProductCollectionSortKeys} from '@shopify/hydrogen/storefront-api-types';

import {COLLECTION_QUERY} from '~/data/queries';
import {getSiteSettings} from '~/lib/utils';
import {routeHeaders} from '~/data/cache';

export const headers = routeHeaders;

export async function loader({context, request}: LoaderFunctionArgs) {
  const {storefront} = context;
  const siteSettings = await getSiteSettings(context);
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const handle = String(searchParams.get('handle') || '');
  const sortKey = (String(searchParams.get('sortKey') || '').toUpperCase() ||
    'COLLECTION_DEFAULT') as ProductCollectionSortKeys;
  const reverse = Boolean(searchParams.get('reverse') ?? false);
  const first = Number(searchParams.get('first')); // customize number of products to fetch with this request

  const resultsPerPage = Math.floor(
    Number(
      first ||
        siteSettings?.data?.siteSettings?.settings?.collection?.pagination
          ?.resultsPerPage,
    ) || 24,
  );

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

  return json({collection});
}
