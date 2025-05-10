import type {Product} from '@shopify/hydrogen/storefront-api-types';
import {useMemo} from 'react';

import {PRODUCT_METAFIELDS_IDENTIFIERS} from '~/lib/constants';
import type {ParsedMetafields} from '~/lib/types';
import {parseMetafieldsFromProduct} from '~/lib/utils';

/**
 * Parse metafields from product
 * @param product - product
 * @param fetchOnMount - Determines when to fetch
 * @returns Oject with `${namespace}.${key}` as key and the value as the metafield
 * @example
 * ```js
 * const metafields = useParsedProductMetafields(product);
 * ```
 */

export function useParsedProductMetafields(
  product: Product | undefined | null,
  fetchOnMount = true,
): ParsedMetafields {
  return useMemo(() => {
    if (!fetchOnMount || !product) return {};
    return parseMetafieldsFromProduct({
      product,
      identifiers: PRODUCT_METAFIELDS_IDENTIFIERS,
    });
  }, [fetchOnMount, product]);
}

//
