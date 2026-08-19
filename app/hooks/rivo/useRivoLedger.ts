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
 * @example
 * ```js
 * const {entries, isLoading} = useRivoLedger(10);
 * ```
 */
export function useRivoLedger(limit = 10, fetchOnMount = true) {
  const customer = useCustomer();
  const {pathPrefix} = useLocale();

  const {data, error, isLoading, mutate} = useLoadData<
    RivoApiResponse<RivoLedgerEntry[]>
  >(
    fetchOnMount && customer
      ? `${pathPrefix}/api/rivo?action=getPointsLogs&limit=${limit}`
      : null,
  );

  return {
    entries: data?.data || [],
    isLoggedIn: !!customer,
    isLoading,
    error: data?.error || (error ? 'Unable to load history.' : null),
    refresh: mutate,
  };
}
