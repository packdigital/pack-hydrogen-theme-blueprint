import {useMemo} from 'react';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

import {useLoadData, useLocale} from '~/hooks';

/**
 * Fetch products by ids
 * @param ids - Array of product ids
 * @param fetchOnMount - Determines when to fetch
 * @returns array of product items
 * @example
 * ```js
 * const products = useProductsByIds(['gid://shopify/Product/12345', 'gid://shopify/Product/67890']);
 * ```
 */

export function useProductsByIds(
  ids: string[] = [],
  fetchOnMount = true,
): Product[] {
  const {pathPrefix} = useLocale();

  const idsString = JSON.stringify(ids);

  const apiPath = useMemo(() => {
    if (!fetchOnMount || !ids?.length) return null;
    const searchParams = new URLSearchParams({
      query: ids
        .filter(Boolean)
        .map((id) => {
          return `id:${typeof id === 'number' ? id : id.split('/').pop()}`;
        })
        .join(' OR '),
      count: ids.length.toString(),
    });
    return `${pathPrefix}/api/products?${searchParams}`;
  }, [fetchOnMount, idsString]);

  const {data} = useLoadData<{products: Product[]}>(apiPath);

  return useMemo(() => {
    if (!ids?.length || !data?.products?.length) return [];
    const productsById = data.products.reduce(
      (acc: Record<string, Product>, product) => {
        if (!product) return acc;
        return {...acc, [product.id]: product};
      },
      {},
    );
    // Ensure products are returned in the same order as the ids
    return ids.reduce((acc: Product[], id) => {
      if (!productsById[id]) return acc;
      return [...acc, productsById[id]];
    }, []);
  }, [data?.products, idsString]);
}
