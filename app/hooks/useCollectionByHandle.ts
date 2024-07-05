import {useEffect} from 'react';
import {useFetcher} from '@remix-run/react';
import type {
  Collection,
  ProductCollectionSortKeys,
} from '@shopify/hydrogen/storefront-api-types';

import {useLocale} from '~/hooks';

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
  const fetcher = useFetcher<{collection: Collection}>({
    key: `collection-by-handle:${handle}:${pathPrefix}`,
  });

  useEffect(() => {
    if (!fetchOnMount || !handle || fetcher.data?.collection) return;
    const paramsAsStrings = Object.entries({...params}).reduce(
      (acc: Record<string, string>, [key, value]) => {
        acc[key] = String(value);
        return acc;
      },
      {},
    );
    const searchParams = new URLSearchParams({handle, ...paramsAsStrings});
    fetcher.load(`${pathPrefix}/api/collection?${searchParams}`);
  }, [fetchOnMount, handle, JSON.stringify(params)]);

  return (fetcher.data?.collection as Collection) || null;
}
