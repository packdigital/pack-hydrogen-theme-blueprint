import {getPaginationVariables} from '@shopify/hydrogen';

import {COLLECTION_QUERY} from '~/data/graphql/storefront/collection';
import {routeHeaders} from '~/data/cache';
import {transformShopifyGids} from '~/lib/utils';

import type {Route} from './+types/($locale).collections.$handle[.]json';

export const headers = routeHeaders;

export async function loader({params, context, request}: Route.LoaderArgs) {
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
