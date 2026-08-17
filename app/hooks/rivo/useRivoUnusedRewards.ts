import {useCallback, useState} from 'react';

import {useCustomer, useLoadData, useLocale} from '~/hooks';
import type {RivoUnusedReward} from '~/lib/rivo';

import {useRivoApplyCode} from './useRivoApplyCode';

interface RivoApiResponse<TData> {
  data: TData | null;
  error: string | null;
}

/**
 * Rewards the customer has already spent points on but not used.
 *
 * Points leave the balance the moment a redemption is created, so any code whose
 * cart application failed is still owed to them. This exposes those codes and
 * lets them be re-applied, so a failed apply never destroys a paid-for reward.
 *
 * @example
 * ```js
 * const {rewards, apply, applyingCode, refresh} = useRivoUnusedRewards();
 * ```
 */
export function useRivoUnusedRewards(fetchOnMount = true) {
  const customer = useCustomer();
  const {pathPrefix} = useLocale();
  const {applyCode} = useRivoApplyCode();
  const [applyingCode, setApplyingCode] = useState<string | null>(null);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);

  const {data, error, isLoading, mutate} = useLoadData<
    RivoApiResponse<RivoUnusedReward[]>
  >(
    fetchOnMount && customer
      ? `${pathPrefix}/api/rivo?action=getUnusedRewards`
      : null,
  );

  const apply = useCallback(
    async (reward: RivoUnusedReward) => {
      setApplyingCode(reward.code);
      setApplyError(null);
      setAppliedCode(null);
      try {
        const {applied, error: applyFailure} = await applyCode({
          code: reward.code,
          cartStrategy: reward.cartStrategy,
          variantIds: reward.variantIds,
        });
        if (applyFailure) {
          setApplyError(applyFailure);
        } else if (applied) {
          setAppliedCode(reward.code);
        }
        return {applied, error: applyFailure};
      } finally {
        setApplyingCode(null);
      }
    },
    [applyCode],
  );

  return {
    rewards: data?.data || [],
    isLoggedIn: !!customer,
    isLoading,
    error: data?.error || (error ? 'Unable to load your rewards.' : null),
    /** Re-apply a code the customer already paid for. */
    apply,
    /** Code currently being applied, for per-row button state. */
    applyingCode,
    applyError,
    appliedCode,
    refresh: mutate,
  };
}
