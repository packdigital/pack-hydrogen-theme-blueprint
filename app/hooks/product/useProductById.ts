import {useEffect} from 'react';
import {useFetcher} from '@remix-run/react';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

import {useLocale} from '~/hooks';

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
  const fetcher = useFetcher<{product: Product}>();

  useEffect(() => {
    if (!fetchOnMount || !id) return;
    const searchParams = new URLSearchParams({id});
    fetcher.load(`${pathPrefix}/api/product-by-id?${searchParams}`);
  }, [fetchOnMount, id]);

  return fetcher.data?.product || null;
}
