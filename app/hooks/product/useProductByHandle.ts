import {useEffect} from 'react';
import {useFetcher} from '@remix-run/react';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

import {useLocale} from '~/hooks';

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
  addKeyIdentifier = false,
): Product | null {
  const {pathPrefix} = useLocale();
  const fetcher = useFetcher<{product: Product}>({
    key: addKeyIdentifier
      ? `product-by-handle:${handle}:${pathPrefix}`
      : undefined,
  });

  useEffect(() => {
    if (!fetchOnMount || !handle) return;
    const searchParams = new URLSearchParams({handle});
    fetcher.load(`${pathPrefix}/api/product?${searchParams}`);
  }, [fetchOnMount, handle]);

  return fetcher.data?.product || null;
}
