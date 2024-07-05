import {useCallback, useEffect, useState} from 'react';
import {useFetcher} from '@remix-run/react';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

import {useGroupingsContext} from '~/contexts';
import {formatGroupingWithOptions} from '~/lib/utils';
import type {Group} from '~/lib/types';
import {useLocale} from '~/hooks';

/**
 * Get product grouping object by handle from cache
 * @param handle handle of product
 * @param fetchOnMount - Determines when to fetch
 * @returns product grouping object
 * @example
 * ```js
 * const grouping = useProductGroupingByHandle('product-handle');
 * ```
 */

export function useProductGroupingByHandle(
  handle: string | undefined | null = '',
  fetchOnMount = true,
): Group | null {
  const {pathPrefix} = useLocale();
  const fetcher = useFetcher<{products: Product[]}>({
    key: `product-grouping-by-handle:${handle}:${pathPrefix}`,
  });
  const {actions, state} = useGroupingsContext();
  const {setGroupings} = actions;
  const {groupings, groupingIndexesMap} = state;

  const groupingIndex = groupingIndexesMap?.[handle || ''] ?? -1;
  const cachedGrouping = groupings?.[groupingIndex]?.isReady
    ? groupings[groupingIndex]
    : null;

  const [grouping, setGrouping] = useState<Group | null>(cachedGrouping);

  const getProductGroupingByHandle = useCallback(
    (_handle: string | undefined = '') => {
      if (!groupings?.length) return null;
      const _groupingIndex = groupingIndexesMap?.[_handle] ?? -1;
      if (!(_groupingIndex >= 0)) return null;
      return groupings[_groupingIndex];
    },
    [groupings, groupingIndexesMap],
  );

  const groupingIsReady = !!grouping?.isReady;

  useEffect(() => {
    if (!fetchOnMount || !groupings || !handle || groupingIsReady) return;
    setGrouping(getProductGroupingByHandle(handle));
  }, [fetchOnMount, groupings, handle]);

  useEffect(() => {
    if (!grouping?.allProducts || groupingIsReady) return;
    const searchParams = new URLSearchParams({
      handles: grouping.allProducts.map(({handle}) => handle).join(','),
    });
    fetcher.load(`${pathPrefix}/api/products?${searchParams}`);
  }, [grouping?.id]);

  useEffect(() => {
    if (!grouping || !fetcher.data?.products) return;
    const productsByHandle = fetcher.data.products.reduce(
      (acc: Record<string, Product>, product: Product) => {
        if (!product) return acc;
        return {...acc, [product.handle]: product};
      },
      {},
    );
    const groupingWithOptions = formatGroupingWithOptions({
      grouping,
      getProductByHandle: (handle: string) => productsByHandle[handle],
    });
    const readyGrouping = {
      ...groupingWithOptions,
      productsByHandle,
      isReady: true,
    } as Group;
    const updatedGroupings = groupings;
    updatedGroupings[groupingIndex] = readyGrouping;
    setGrouping(readyGrouping);
    setGroupings(updatedGroupings);
  }, [grouping?.id, fetcher.data?.products]);

  return grouping;
}
