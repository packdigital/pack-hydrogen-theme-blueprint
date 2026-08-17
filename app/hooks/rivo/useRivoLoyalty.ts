import {useCustomer, useLoadData, useLocale} from '~/hooks';
import type {RivoLoyaltySummary} from '~/lib/rivo';

interface RivoApiResponse<TData> {
  data: TData | null;
  error: string | null;
}

/**
 * Fetch the logged-in customer's Rivo loyalty summary — status, properties, VIP
 * tiers and redeemable rewards — in a single request.
 *
 * Returns `null` data when no customer is logged in; Rivo is customer-scoped so
 * there is nothing to show for guests.
 *
 * @example
 * ```js
 * const {summary, isLoading, error, refresh} = useRivoLoyalty();
 * ```
 */
export function useRivoLoyalty(fetchOnMount = true) {
  const customer = useCustomer();
  const {pathPrefix} = useLocale();

  const {data, error, isLoading, isValidating, mutate} = useLoadData<
    RivoApiResponse<RivoLoyaltySummary>
  >(
    fetchOnMount && customer
      ? `${pathPrefix}/api/rivo?action=getLoyaltySummary`
      : null,
  );

  const summary = data?.data || null;

  return {
    summary,
    status: summary?.status || null,
    properties: summary?.properties || null,
    vipTiers: summary?.vipTiers || [],
    rewards: summary?.rewards || [],
    pointsTally:
      summary?.status?.points_tally ??
      summary?.properties?.points_tally ??
      null,
    creditsTally:
      summary?.status?.credits_tally ??
      summary?.properties?.credits_tally ??
      null,
    isLoggedIn: !!customer,
    isLoading,
    isValidating,
    error: data?.error || (error ? 'Unable to load loyalty data.' : null),
    /** Re-fetch after a redemption so balances reflect the spend. */
    refresh: mutate,
  };
}
