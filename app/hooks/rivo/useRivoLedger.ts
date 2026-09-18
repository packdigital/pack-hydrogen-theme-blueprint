import {useCallback, useState} from 'react';

import {useCustomer, useLoadData, useLocale} from '~/hooks';
import type {RivoLedgerEntry} from '~/lib/rivo';

interface RivoApiResponse<TData> {
  data: TData | null;
  error: string | null;
}

/**
 * Fetch the logged-in customer's loyalty ledger (`GET /points_events`).
 *
 * Covers both points and store credit — Rivo puts them on the same event, so an
 * entry carries `amount` (points) and `creditsAmount`. Revoked, hidden and
 * no-movement events are already filtered out server-side.
 *
 * Paging matches Rivo's own "Show more" button rather than an infinite scroll:
 * each call raises the page size, so the list only ever grows and the rows
 * already on screen never re-order. Rivo's collection responses carry no total,
 * so "there is more" is inferred from a full page coming back.
 *
 * @example
 * ```js
 * const {entries, hasMore, loadMore} = useRivoLedger(10);
 * ```
 */
export function useRivoLedger(limit = 10, fetchOnMount = true) {
  const customer = useCustomer();
  const {pathPrefix} = useLocale();
  const [pageSize, setPageSize] = useState(limit);

  const {data, error, isLoading, isValidating, mutate} = useLoadData<
    RivoApiResponse<RivoLedgerEntry[]>
  >(
    fetchOnMount && customer
      ? `${pathPrefix}/api/rivo?action=getPointsLogs&limit=${pageSize}`
      : null,
  );

  const entries = data?.data || [];

  // Rivo returns no pagination metadata, and the server drops revoked, hidden
  // and zero-movement rows — so a short page can still mean more exist upstream.
  // Comparing against the requested size is the available signal; it can offer
  // one redundant "Show more" at the end rather than hiding real history.
  const hasMore = entries.length >= pageSize;

  const loadMore = useCallback(() => {
    setPageSize((current) => current + limit);
  }, [limit]);

  return {
    entries,
    isLoggedIn: !!customer,
    isLoading,
    /** True while a "Show more" fetch is in flight, with rows already on screen. */
    isLoadingMore: isValidating && !isLoading,
    hasMore,
    loadMore,
    error: data?.error || (error ? 'Unable to load history.' : null),
    refresh: mutate,
  };
}
