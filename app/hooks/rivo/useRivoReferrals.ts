import {useCustomer, useLoadData, useLocale} from '~/hooks';
import type {RivoReferral, RivoReferralStats} from '~/lib/rivo';

interface RivoApiResponse<TData> {
  data: TData | null;
  error: string | null;
}

/**
 * Fetch the logged-in customer's referral link and stats, and optionally the
 * individual referrals behind them.
 *
 * @example
 * ```js
 * const {stats, referrals, isLoading} = useRivoReferrals();
 * ```
 */
export function useRivoReferrals({
  includeReferrals = false,
  fetchOnMount = true,
}: {includeReferrals?: boolean; fetchOnMount?: boolean} = {}) {
  const customer = useCustomer();
  const {pathPrefix} = useLocale();
  const enabled = fetchOnMount && !!customer;

  const {
    data: statsData,
    error: statsError,
    isLoading: statsLoading,
    mutate: refreshStats,
  } = useLoadData<RivoApiResponse<RivoReferralStats>>(
    enabled ? `${pathPrefix}/api/rivo?action=getReferralStats` : null,
  );

  const {
    data: referralsData,
    isLoading: referralsLoading,
    mutate: refreshReferrals,
  } = useLoadData<RivoApiResponse<RivoReferral[]>>(
    enabled && includeReferrals
      ? `${pathPrefix}/api/rivo?action=getReferrals`
      : null,
  );

  return {
    stats: statsData?.data || null,
    referrals: referralsData?.data || [],
    isLoggedIn: !!customer,
    isLoading: statsLoading || referralsLoading,
    error:
      statsData?.error || (statsError ? 'Unable to load referral data.' : null),
    refresh: () => Promise.all([refreshStats(), refreshReferrals()]),
  };
}
