import {useEffect} from 'react';
import {useFetcher} from '@remix-run/react';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';

import {useLocale} from '~/hooks';

/**
 * Fetch collection by its handle
 * @param handle - The handle of the collection
 * @param searchParams - Any search params to be used in the query
 * @param fetchOnMount - Determines when to fetch
 * @returns collection
 * @example
 * ```js
 * const collection = useCollectionByHandle('all');
 * ```
 */

export function useCollectionByHandle(
  handle: string | undefined | null = '',
  searchParams?: URLSearchParams,
  fetchOnMount = true,
): Collection | null {
  const {pathPrefix} = useLocale();
  const fetcher = useFetcher<{collection: Collection}>({
    key: `collection-by-handle:${handle}:${pathPrefix}`,
  });
  const search = searchParams?.toString();

  useEffect(() => {
    if (!fetchOnMount || !handle || fetcher.data?.collection) return;
    fetcher.load(`/collections/${handle}${search ? `?${search}` : ''}`);
  }, [fetchOnMount, handle, search]);

  return fetcher.data?.collection || null;
}
