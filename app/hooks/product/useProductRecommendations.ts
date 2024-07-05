import {useEffect} from 'react';
import {useFetcher} from '@remix-run/react';
import type {
  Product,
  ProductRecommendationIntent,
} from '@shopify/hydrogen/storefront-api-types';

import {useLocale} from '~/hooks';

/**
 * Fetch up to 10 product recommendations for a given product id
 * @param productId - The id of the product
 * @param intent - https://shopify.dev/docs/api/storefront/latest/enums/ProductRecommendationIntent
 * @param fetchOnMount - Determines when to fetch
 * @returns array of product items
 * @example
 * ```js
 * const productRecommendations = productRecommendations('gid://shopify/Product/1234567890', 'RELATED');
 * ```
 */

export function useProductRecommendations(
  productId = '',
  intent: ProductRecommendationIntent = 'RELATED', // 'COMPLEMENTARY' | 'RELATED'
  fetchOnMount = true,
): Product[] | null {
  const {pathPrefix} = useLocale();
  const fetcher = useFetcher<{productRecommendations: Product[]}>({
    key: `product-recommendations:${productId}${intent}:${pathPrefix}`,
  });

  useEffect(() => {
    if (
      !fetchOnMount ||
      !productId ||
      !intent ||
      fetcher.data?.productRecommendations
    )
      return;
    const searchParams = new URLSearchParams({productId, intent});
    fetcher.load(`${pathPrefix}/api/recommendations?${searchParams}`);
  }, [fetchOnMount, productId, intent]);

  return fetcher.data?.productRecommendations || null;
}
