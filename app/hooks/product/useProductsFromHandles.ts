import {useEffect} from 'react';
import {useFetcher} from '@remix-run/react';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

import {useLocale} from '~/hooks';

/**
 * Fetch products by handles
 * @param handles - Array of product handles
 * @returns array of product items
 * @example
 * ```js
 * const products = useProductsFromHandles(['product-handle-1', 'product-handle-2']);
 * ```
 */

export function useProductsFromHandles(handles: string[] = []): Product[] {
  const {pathPrefix} = useLocale();
  const fetcher = useFetcher<{products: Product[]}>({
    key: `products-from-handles:${handles.join(',')}:${pathPrefix}`,
  });

  useEffect(() => {
    if (!handles?.length || fetcher.data?.products) return;
    fetcher.submit(
      {handles},
      {method: 'POST', action: `${pathPrefix}/api/products`},
    );
  }, [handles]);

  return fetcher.data?.products || [];
}
