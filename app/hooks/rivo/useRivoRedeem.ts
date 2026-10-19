import {useCallback, useState} from 'react';

import {useLocale} from '~/hooks';
import type {RivoRedemption, RivoReward} from '~/lib/rivo';

import {useRivoApplyCode} from './useRivoApplyCode';

export interface RivoRedeemResult {
  redemption: RivoRedemption | null;
  /** Copy suitable for surfacing to the customer. */
  message: string | null;
  error: string | null;
}

interface RedeemArgs {
  reward: RivoReward;
  /** Incremental rewards only: points to spend. */
  pointsAmount?: number | null;
  /** Incremental rewards only: credits to spend. */
  creditsAmount?: number | null;
}

const buildMessage = (redemption: RivoRedemption) => {
  const name = redemption.rewardName;

  switch (redemption.rewardType) {
    case 'gift_card':
      return 'Gift card issued. It will be available as a payment method at checkout.';
    case 'points_to_credit':
      return redemption.formattedStoreCreditAmount
        ? `${redemption.formattedStoreCreditAmount} in store credit added to your account.`
        : 'Store credit added to your account.';
    case 'free_product':
      return name
        ? `${name} added to your cart.`
        : 'Your free gift has been added to your cart.';
    case 'free_shipping':
      return 'Free shipping applied to your cart.';
    default:
      return name
        ? `${name} applied to your cart.`
        : 'Your reward has been applied to your cart.';
  }
};

/**
 * Redeem a Rivo reward and apply the result to the Hydrogen cart.
 *
 * Rivo redemptions produce standard Shopify discount codes, so the flow is:
 * redeem server-side → receive the discount code → apply it with
 * `cartDiscountCodesUpdate`. Free-product rewards additionally add the free
 * variant with `cartLinesAdd`. Gift-card and store-credit rewards touch the
 * cart not at all — Shopify settles those at checkout.
 *
 * Points are spent before the cart mutation runs, so a cart failure never
 * discards the reward: the code is surfaced in the error, and it also shows up
 * in the unused-rewards list until it is used.
 *
 * @example
 * ```js
 * const {redeem, isRedeeming, result} = useRivoRedeem({onSuccess: refresh});
 * await redeem({reward});
 * ```
 */
export function useRivoRedeem({
  onSuccess,
}: {onSuccess?: (redemption: RivoRedemption) => void} = {}) {
  const {pathPrefix} = useLocale();
  const {applyCode} = useRivoApplyCode();
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [result, setResult] = useState<RivoRedeemResult>({
    redemption: null,
    message: null,
    error: null,
  });

  const reset = useCallback(() => {
    setResult({redemption: null, message: null, error: null});
  }, []);

  const redeem = useCallback(
    async ({
      reward,
      pointsAmount,
      creditsAmount,
    }: RedeemArgs): Promise<RivoRedeemResult> => {
      const fail = (
        error: string,
        redemption: RivoRedemption | null = null,
      ) => {
        const failure = {redemption, message: null, error};
        setResult(failure);
        return failure;
      };

      setIsRedeeming(true);
      setResult({redemption: null, message: null, error: null});

      try {
        const formData = new FormData();
        formData.append('action', 'redeemReward');
        formData.append('rewardId', String(reward.id));
        if (pointsAmount) formData.append('pointsAmount', String(pointsAmount));
        if (creditsAmount)
          formData.append('creditsAmount', String(creditsAmount));

        const response = await fetch(`${pathPrefix}/api/rivo`, {
          method: 'POST',
          body: formData,
        });
        const payload = (await response.json()) as {
          data: RivoRedemption | null;
          error: string | null;
        };

        if (!response.ok || payload.error || !payload.data) {
          return fail(payload.error || 'Unable to redeem this reward.');
        }

        const redemption = payload.data;

        if (redemption.code) {
          const {error} = await applyCode({
            code: redemption.code,
            cartStrategy: redemption.cartStrategy,
            variantIds: redemption.variantIds,
          });
          // The points are spent either way, so still report the redemption and
          // let the caller refresh — the code will appear in unused rewards.
          if (error) {
            onSuccess?.(redemption);
            return fail(error, redemption);
          }
        }

        const message = buildMessage(redemption);
        const success = {redemption, message, error: null};
        setResult(success);
        onSuccess?.(redemption);
        return success;
      } catch (error) {
        console.error('useRivoRedeem:error:', error);
        return fail(
          error instanceof Error
            ? error.message
            : 'Unable to redeem this reward.',
        );
      } finally {
        setIsRedeeming(false);
      }
    },
    [applyCode, onSuccess, pathPrefix],
  );

  return {redeem, isRedeeming, result, reset};
}
