import {useEffect} from 'react';
import {useFetcher} from '@remix-run/react';
import type {Metafield} from '@shopify/hydrogen/storefront-api-types';

import {useLocale} from '~/hooks';

/**
 * Fetch specific metafields for a product
 * @param handle - The handle of the product
 * @param metafieldQueries - An array of objects with `key` and `namespace` properties
 * @returns Oject with `${namespace}.${key}` as key and the value as the metafield
 * @example
 * ```js
 * const metafields = useProductMetafields('product-handle', [
 *  {namespace: 'global', key: 'description'},
 *  {namespace: 'product', key: 'seasonal_colors'}
 * ]);
 * ```
 */

interface MetafieldQuery {
  namespace: string;
  key: string;
}

export function useProductMetafields(
  handle: string | undefined | null = '',
  metafieldQueries: MetafieldQuery[] = [],
): Record<string, Metafield> | null {
  const {pathPrefix} = useLocale();
  const metafieldQueriesString = JSON.stringify(metafieldQueries);
  const fetcher = useFetcher<{
    metafields: Record<string, Metafield> | null;
  }>({
    key: `product-metafields:${handle}:${pathPrefix}:${metafieldQueriesString}`,
  });
  const {metafields} = {...fetcher.data};

  useEffect(() => {
    if (!handle || !metafieldQueries?.length) return;
    fetcher.submit(
      {handle, metafieldQueries: metafieldQueriesString},
      {method: 'POST', action: `${pathPrefix}/api/product`},
    );
  }, [handle, metafieldQueriesString]);

  return metafields || null;
}
