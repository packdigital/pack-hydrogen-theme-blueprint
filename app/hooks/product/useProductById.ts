import type {Product} from '@shopify/hydrogen/storefront-api-types';

import {useLoadData, useLocale} from '~/hooks';

/**
 * Fetch product item by its id
 * @param id - The id of the product
 * @returns product item
 * @example
 * ```js
 * const product = useProductById('gid://shopify/Product/1234567890');
 * ```
 */

export function useProductById(
  id: string | undefined | null = '',
  fetchOnMount = true,
): Product | null {
  const {pathPrefix} = useLocale();

  const {data} = useLoadData<{product: Product}>(
    fetchOnMount && id ? `${pathPrefix}/api/product-by-id?id=${id}` : null,
  );

  return data?.product || null;
}
