import {useEffect} from 'react';
import {useFetcher} from '@remix-run/react';

import {useLocale} from '~/hooks';
import type {MetafieldIdentifier, ParsedMetafields} from '~/lib/types';

/**
 * Fetch specific metafields for a product
 * @param handle - The handle of the product
 * @param metafieldIdentifiers - An array of objects with `key` and `namespace` properties
 * @param fetchOnMount - Determines when to fetch
 * @returns Oject with `${namespace}.${key}` as key and the value as the metafield
 * @example
 * ```js
 * const metafields = useProductMetafields('product-handle', [
 *  {namespace: 'global', key: 'description'},
 *  {namespace: 'product', key: 'seasonal_colors'}
 * ]);
 * ```
 */

export function useProductMetafields(
  handle: string | undefined | null = '',
  metafieldIdentifiers: MetafieldIdentifier[] = [],
  fetchOnMount = true,
): ParsedMetafields | null {
  const {pathPrefix} = useLocale();
  const metafieldIdentifiersString = JSON.stringify(metafieldIdentifiers);
  const fetcher = useFetcher<{
    metafields: ParsedMetafields | null;
  }>({
    key: `product-metafields:${handle}:${pathPrefix}:${metafieldIdentifiersString}`,
  });
  const {metafields} = {...fetcher.data};

  useEffect(() => {
    if (!fetchOnMount || !handle || !metafieldIdentifiers?.length) return;
    const searchParams = new URLSearchParams({
      handle,
      metafieldIdentifiers: metafieldIdentifiersString,
    });
    fetcher.load(`${pathPrefix}/api/product?${searchParams}`);
  }, [fetchOnMount, handle, metafieldIdentifiersString]);

  return (metafields as ParsedMetafields) || null;
}
