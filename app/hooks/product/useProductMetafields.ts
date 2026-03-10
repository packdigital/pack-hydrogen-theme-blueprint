import {useLoadData, useLocale} from '~/hooks';
import type {MetafieldIdentifier, ParsedMetafields} from '~/lib/types';

/**
 * Fetch specific metafields for a product
 * @param handle - The handle of the product
 * @param metafieldIdentifiers - An array of objects with `key` and `namespace` properties
 * @param fetchOnMount - Determines when to fetch
 * @returns Object with `${namespace}.${key}` as key and the value as the metafield
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

  const {data} = useLoadData<{metafields: ParsedMetafields}>(
    fetchOnMount && handle && metafieldIdentifiers?.length
      ? `${pathPrefix}/api/product?handle=${handle}&metafieldIdentifiers=${JSON.stringify(
          metafieldIdentifiers,
        )}`
      : null,
  );

  return (data?.metafields as ParsedMetafields) || null;
}
