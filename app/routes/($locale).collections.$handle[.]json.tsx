import {getPaginationVariables} from '@shopify/hydrogen';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {COLLECTION_QUERY} from '~/data/graphql/storefront/collection';
import {routeHeaders} from '~/data/cache';
import {transformShopifyGids} from '~/lib/utils';

export const headers = routeHeaders;

export async function loader({params, context, request}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) throw new Response(null, {status: 404});

  const paginationVariables = getPaginationVariables(request, {
    pageBy: 24,
  });

  const collection = await storefront.query(COLLECTION_QUERY, {
    variables: {
      handle,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
      ...paginationVariables,
    },
    cache: storefront.CacheShort(),
  });

  if (!collection) throw new Response(null, {status: 404});
  const transformedCollection = transformShopifyGids(collection);

  return Response.json(transformedCollection);
}
