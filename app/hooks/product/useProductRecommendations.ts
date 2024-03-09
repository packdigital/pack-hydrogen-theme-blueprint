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
 * @returns array of product items
 * @example
 * ```js
 * const productRecommendations = productRecommendations('gid://shopify/Product/1234567890', 'RELATED');
 * ```
 */

export function useProductRecommendations(
  productId = '',
  intent: ProductRecommendationIntent = 'RELATED',
): Product[] | null {
  const {pathPrefix} = useLocale();
  const fetcher = useFetcher<{productRecommendations: Product[]}>({
    key: `product-recommendations:${productId}${intent}:${pathPrefix}`,
  });

  useEffect(() => {
    if (!productId || !intent || fetcher.data?.productRecommendations) return;
    fetcher.submit(
      {productId, intent},
      {method: 'POST', action: `${pathPrefix}/api/recommendations`},
    );
  }, [productId, intent]);

  return fetcher.data?.productRecommendations || null;
}
