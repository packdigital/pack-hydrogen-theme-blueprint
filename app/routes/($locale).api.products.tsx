import {json} from '@shopify/remix-oxygen';
import type {ActionFunctionArgs} from '@shopify/remix-oxygen';
import type {ProductSortKeys} from '@shopify/hydrogen/storefront-api-types';

import {PRODUCTS_QUERY, PRODUCT_ITEM_QUERY} from '~/data/queries';
import {queryProducts} from '~/lib/products.server';

const badProductsRequest = (message: string) => {
  return json(
    {totalProducts: 0, products: null, errors: [message]},
    {status: 400},
  );
};

export async function action({request, context}: ActionFunctionArgs) {
  const {storefront} = context;
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  let body;
  try {
    body = await request.formData();
  } catch (error) {}
  const handlesData = String(body?.get('handles') ?? '');

  /* Products query by handles */
  if (handlesData) {
    const handles = handlesData.split(',');
    if (!handles.every((handle) => typeof handle === 'string')) {
      return badProductsRequest('Invalid handles paramater');
    }
    const products = await Promise.all(
      handles
        .map(async (handle) => {
          if (typeof handle !== 'string') return null;
          const {product} = await storefront.query(PRODUCT_ITEM_QUERY, {
            variables: {
              handle,
              country: storefront.i18n.country,
              language: storefront.i18n.language,
            },
            cache: storefront.CacheShort(),
          });
          return product;
        })
        .filter(Boolean),
    );
    if (!products?.length) return badProductsRequest('No products found');
    const errors =
      products.length < handles.length
        ? {errors: ['Not all handles returned a product']}
        : null;
    return json({totalProducts: products.length, products, ...errors});
  }

  /* Products query by query */
  const query = String(body?.get('query') || searchParams.get('query') || '');
  const sortKey = String(
    ((body?.get('sortKey') ||
      searchParams.get('sortKey')) as null | ProductSortKeys) ?? 'BEST_SELLING',
  );
  const reverse = Boolean(
    body?.get('reverse') || searchParams.get('reverse') || false,
  );
  const count = Number(body?.get('count') || searchParams.get('count') || 10);

  const {products} = await queryProducts({
    context,
    query: PRODUCTS_QUERY,
    variables: {query, reverse, sortKey},
    count,
  });

  return json({totalProducts: products?.length ?? 0, products});
}
