import {useEffect} from 'react';
import {useFetcher} from '@remix-run/react';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

import {useLocale} from '~/hooks';

/**
 * Fetch product item by its handle
 * @param handle - The handle of the product
 * @returns product item
 * @example
 * ```js
 * const product = useProductByHandle('product-handle');
 * ```
 */

export function useProductByHandle(
  handle: string | undefined | null = '',
): Product | null {
  const {pathPrefix} = useLocale();
  const fetcher = useFetcher<{product: Product}>({
    key: `product-by-handle:${handle}:${pathPrefix}`,
  });

  useEffect(() => {
    if (!handle || fetcher.data?.product) return;
    fetcher.submit(
      {handle},
      {method: 'POST', action: `${pathPrefix}/api/product`},
    );
  }, [handle]);

  return fetcher.data?.product || null;
}
