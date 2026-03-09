import {useMemo} from 'react';
import type {
  Collection,
  ProductCollectionSortKeys,
} from '@shopify/hydrogen/storefront-api-types';

import {useLoadData, useLocale} from '~/hooks';

/**
 * Fetch collection by its handle
 * @param handle - The handle of the collection
 * @param params - Collection products query params
 * @param fetchOnMount - Determines when to fetch
 * @returns collection
 * @example
 * ```js
 * const collection = useCollectionByHandle('all');
 * ```
 */

interface Params {
  sortKey?: ProductCollectionSortKeys;
  reverse?: boolean;
  first?: number;
}

export function useCollectionByHandle(
  handle: string | undefined | null = '',
  params?: Params,
  fetchOnMount = true,
): Collection | null {
  const {pathPrefix} = useLocale();

  const apiPath = useMemo(() => {
    if (!fetchOnMount || !handle) return null;
    const paramsAsStrings = Object.entries({...params}).reduce(
      (acc: Record<string, string>, [key, value]) => {
        acc[key] = String(value);
        return acc;
      },
      {},
    );
    const searchParams = new URLSearchParams({handle, ...paramsAsStrings});
    return `${pathPrefix}/api/collection?${searchParams}`;
  }, [fetchOnMount, handle, JSON.stringify(params)]);

  const {data} = useLoadData<{collection: Collection}>(apiPath);

  return (data?.collection as Collection) || null;
}
