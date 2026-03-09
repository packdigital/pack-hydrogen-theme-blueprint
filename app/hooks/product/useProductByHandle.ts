import type {Product} from '@shopify/hydrogen/storefront-api-types';

import {useLocale, useLoadData} from '~/hooks';

/**
 * Fetch product item by its handle
 * @param handle - The handle of the product
 * @param fetchOnMount - Determines when to fetch
 * @returns product item
 * @example
 * ```js
 * const product = useProductByHandle('product-handle');
 * ```
 */

export function useProductByHandle(
  handle: string | undefined | null = '',
  fetchOnMount = true,
): Product | null {
  const {pathPrefix} = useLocale();

  const {data} = useLoadData<{product: Product}>(
    fetchOnMount && handle
      ? `${pathPrefix}/api/product?handle=${handle}`
      : null,
  );

  return data?.product || null;
}
