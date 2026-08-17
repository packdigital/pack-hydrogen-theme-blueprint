import {useCustomer, useLoadData, useLocale} from '~/hooks';
import type {RivoLedgerEntry} from '~/lib/rivo';

interface RivoApiResponse<TData> {
  data: TData | null;
  error: string | null;
}

/**
 * Fetch the logged-in customer's points or store-credit history.
 *
 * @param type - `points` (`/points_logs`) or `credits` (`/credits_logs`)
 * @example
 * ```js
 * const {entries, isLoading} = useRivoLedger('points', 10);
 * ```
 */
export function useRivoLedger(
  type: 'points' | 'credits' = 'points',
  limit = 10,
  fetchOnMount = true,
) {
  const customer = useCustomer();
  const {pathPrefix} = useLocale();
  const action = type === 'credits' ? 'getCreditsLogs' : 'getPointsLogs';

  const {data, error, isLoading, mutate} = useLoadData<
    RivoApiResponse<RivoLedgerEntry[]>
  >(
    fetchOnMount && customer
      ? `${pathPrefix}/api/rivo?action=${action}&limit=${limit}`
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
