import type {
  Product,
  ProductRecommendationIntent,
} from '@shopify/hydrogen/storefront-api-types';

import {useLoadData, useLocale} from '~/hooks';

/**
 * Fetch up to 10 product recommendations for a given product id
 * @param productId - The id of the product
 * @param intent - https://shopify.dev/docs/api/storefront/latest/enums/ProductRecommendationIntent
 * @param fetchOnMount - Determines when to fetch
 * @returns array of product items
 * @example
 * ```js
 * const productRecommendations = useProductRecommendations('gid://shopify/Product/1234567890', 'RELATED');
 * ```
 */

export function useProductRecommendations(
  productId = '',
  intent: ProductRecommendationIntent = 'RELATED', // 'COMPLEMENTARY' | 'RELATED'
  fetchOnMount = true,
): Product[] | null {
  const {pathPrefix} = useLocale();

  const {data} = useLoadData<{productRecommendations: Product[]}>(
    fetchOnMount && productId && intent
      ? `${pathPrefix}/api/recommendations?productId=${productId}&intent=${intent}`
      : null,
  );

  return data?.productRecommendations || null;
}
