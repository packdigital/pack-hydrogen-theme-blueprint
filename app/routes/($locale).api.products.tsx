import {json} from '@shopify/remix-oxygen';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {ProductSortKeys} from '@shopify/hydrogen/storefront-api-types';

import {PRODUCTS_QUERY} from '~/data/graphql/shopify/product';
import {queryProducts} from '~/lib/products.server';

// Docs: https://shopify.dev/docs/api/storefront/latest/queries/products

export async function loader({request, context}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  /* Products query by query */
  const query = String(searchParams.get('query') || '');
  const sortKey = String(
    (searchParams.get('sortKey') as null | ProductSortKeys) ?? 'BEST_SELLING',
  );
  const reverse = Boolean(searchParams.get('reverse') || false);
  const count = Number(searchParams.get('count')) || 10;

  const {products} = await queryProducts({
    context,
    query: PRODUCTS_QUERY,
    variables: {query, reverse, sortKey},
    count,
  });

  return json({totalProducts: products?.length ?? 0, products});
}
