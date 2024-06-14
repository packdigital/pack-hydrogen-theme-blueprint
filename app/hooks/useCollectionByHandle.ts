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
    fetcher.submit(
      {handle, ...params},
      {method: 'POST', action: `${pathPrefix}/api/collection`},
    );
  }, [fetchOnMount, handle, JSON.stringify(params)]);

  return (fetcher.data?.collection as Collection) || null;
}
