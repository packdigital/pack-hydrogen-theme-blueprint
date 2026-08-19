import {useCustomer, useLoadData, useLocale} from '~/hooks';
import type {RivoLoyaltySummary} from '~/lib/rivo';

interface RivoApiResponse<TData> {
  data: TData | null;
  error: string | null;
}

/**
 * Fetch the logged-in customer's Rivo loyalty summary — their loyalty record,
 * the redeemable rewards catalog and the VIP tier ladder — in one request.
 *
 * Returns `null` when no customer is logged in; Rivo is customer-scoped so
 * there is nothing to show for guests.
 *
 * @example
 * ```js
 * const {customer, rewards, pointsTally, refresh} = useRivoLoyalty();
 * ```
 */
export function useRivoLoyalty(fetchOnMount = true) {
  const shopifyCustomer = useCustomer();
  const {pathPrefix} = useLocale();

  const {data, error, isLoading, isValidating, mutate} = useLoadData<
    RivoApiResponse<RivoLoyaltySummary>
  >(
    fetchOnMount && shopifyCustomer
      ? `${pathPrefix}/api/rivo?action=getLoyaltySummary`
      : null,
  );

  const summary = data?.data || null;

  return {
    summary,
    customer: summary?.customer || null,
    rewards: summary?.rewards || [],
    vipTiers: summary?.vipTiers || [],
    pointsTally: summary?.customer?.pointsTally ?? null,
    creditsTally: summary?.customer?.creditsTally ?? null,
    isLoggedIn: !!shopifyCustomer,
    isLoading,
    isValidating,
    error: data?.error || (error ? 'Unable to load loyalty data.' : null),
    /** Re-fetch after a redemption so balances reflect the spend. */
    refresh: mutate,
  };
}
