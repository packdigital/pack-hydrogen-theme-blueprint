import {json} from '@shopify/remix-oxygen';
import type {ActionFunctionArgs} from '@shopify/remix-oxygen';
import {getPaginationVariables} from '@shopify/hydrogen';
import type {ProductCollectionSortKeys} from '@shopify/hydrogen/storefront-api-types';

import {COLLECTION_QUERY} from '~/data/queries';
import {getSiteSettings} from '~/lib/utils';
import {routeHeaders} from '~/data/cache';

export const headers = routeHeaders;

export async function action({context, request}: ActionFunctionArgs) {
  const {storefront} = context;
  const siteSettings = await getSiteSettings(context);

  let body;
  try {
    body = await request.formData();
  } catch (error) {}

  const handle = String(body?.get('handle') || '');
  const sortKey = (String(body?.get('sortKey') || '').toUpperCase() ||
    'COLLECTION_DEFAULT') as ProductCollectionSortKeys;
  const reverse = Boolean(body?.get('reverse') ?? false);
  const first = Number(body?.get('first')); // customize number of products to fetch with this request

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
