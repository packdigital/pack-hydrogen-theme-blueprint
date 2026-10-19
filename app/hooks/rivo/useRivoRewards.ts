import {useLoadData, useLocale} from '~/hooks';
import type {RivoReward} from '~/lib/rivo';

interface RivoApiResponse<TData> {
  data: TData | null;
  error: string | null;
}

/**
 * Fetch the shop's redeemable rewards catalog (`GET /rewards`).
 *
 * Shop-scoped and guest-safe: the catalog is the same for everyone and contains
 * no customer data, so the route serves it unauthenticated and caches it at the
 * edge. A loyalty landing page has to show guests what the points are worth
 * before they join, which is what Rivo's own Liquid widget does.
 *
 * Signed-in customers already receive the catalog inside `getLoyaltySummary`, so
 * pass `enabled: false` there rather than paying for a second request.
 *
 * @example
 * ```js
 * const {rewards, isLoading} = useRivoRewards({enabled: !isLoggedIn});
 * ```
 */
export function useRivoRewards({enabled = true}: {enabled?: boolean} = {}) {
  const {pathPrefix} = useLocale();

  const {data, error, isLoading, mutate} = useLoadData<
    RivoApiResponse<RivoReward[]>
  >(enabled ? `${pathPrefix}/api/rivo?action=getRewards` : null);

  return {
    rewards: data?.data || [],
    isLoading,
    error: data?.error || (error ? 'Unable to load rewards.' : null),
    refresh: mutate,
  };
}
