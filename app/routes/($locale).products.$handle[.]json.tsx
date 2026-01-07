import {getSelectedProductOptions} from '~/lib/server-utils/product.server';
import {PRODUCT_QUERY} from '~/data/graphql/storefront/product';
import {routeHeaders} from '~/data/cache';
import {transformShopifyGids} from '~/lib/utils';

import type {Route} from './+types/($locale).products.$handle[.]json';

export const headers = routeHeaders;

export async function loader({params, context, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  const selectedOptions = await getSelectedProductOptions({
    handle,
    context,
    request,
  });

  const product = await storefront.query(PRODUCT_QUERY, {
    variables: {
      handle,
      selectedOptions,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
    cache: storefront.CacheShort(),
  });

  const transformedProduct = transformShopifyGids(product);

  return Response.json(transformedProduct);
}
