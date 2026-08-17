import {useCustomer, useLoadData, useLocale} from '~/hooks';
import type {RivoLedgerEntry} from '~/lib/rivo';

interface RivoApiResponse<TData> {
  data: TData | null;
  error: string | null;
}

/**
 * Fetch the logged-in customer's points history (`GET /points_events`).
 *
 * There is no store-credit equivalent on Rivo's Merchant API — `/credits_events`
 * and `/credits_logs` both 404 — so credit is only available as a tally via
 * {@link useRivoLoyalty}.
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
