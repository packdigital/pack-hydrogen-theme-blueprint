import {useEffect} from 'react';
import {useFetcher} from '@remix-run/react';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';

import {useLocale} from '~/hooks';

/**
 * Fetch collection by its handle
 * @param handle - The handle of the collection
 * @param searchParams - Any search params to be used in the query
 * @returns collection
 * @example
 * ```js
 * const collection = useCollectionByHandle('all');
 * ```
 */

export function useCollectionByHandle(
  handle: string | undefined | null = '',
  searchParams?: URLSearchParams,
): Collection | null {
  const {pathPrefix} = useLocale();
  const fetcher = useFetcher<{product: Collection}>({
    key: `collection-by-handle:${handle}:${pathPrefix}`,
  });
  const search = searchParams?.toString();

  useEffect(() => {
    if (!handle || fetcher.data?.collection) return;
    fetcher.load(`/collections/${handle}${search ? `?${search}` : ''}`);
  }, [handle, search]);

  return fetcher.data?.collection || null;
}
