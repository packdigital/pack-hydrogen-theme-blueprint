import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {CART_ATTRIBUTES_QUERY} from '~/data/graphql/storefront/cart';

export async function loader({request, context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const url = new URL(request.url);

  const searchParams = new URLSearchParams(url.search);
  const id = String(searchParams.get('id') || '');

  const cart = await storefront.query(CART_ATTRIBUTES_QUERY, {
    variables: {
      id,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
    cache: storefront.CacheShort(),
  });

  return cart;
}
