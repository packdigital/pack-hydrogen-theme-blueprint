import {useCallback, useState} from 'react';
import type {CartDiscountCode} from '@shopify/hydrogen/storefront-api-types';

import {useCart, useLocale} from '~/hooks';
import type {RivoRedemption, RivoReward} from '~/lib/rivo';

/** Shopify applies at most 5 discount codes per order. */
const MAX_DISCOUNT_CODES = 5;

export interface RivoRedeemResult {
  redemption: RivoRedemption | null;
  /** Copy suitable for surfacing to the customer. */
  message: string | null;
  error: string | null;
}

interface RedeemArgs {
  /** Fixed reward. Pass the reward, or `rewardId` for a bare id. */
  reward?: RivoReward | null;
  rewardId?: string | number | null;
  /** Incremental / custom reward: points to redeem. */
  points?: number | null;
  /** Incremental / custom reward: credits to redeem. */
  credits?: number | null;
}

const buildMessage = (redemption: RivoRedemption) => {
  const value = redemption.formattedValue;

  switch (redemption.rewardType) {
    case 'gift_card':
      return 'Gift card issued. It will be available as a payment method at checkout.';
    case 'points_to_credit':
      return redemption.formattedStoreCreditAmount
        ? `${redemption.formattedStoreCreditAmount} in store credit added to your account.`
        : 'Store credit added to your account.';
    case 'free_product':
      return value
        ? `${value} added to your cart.`
        : 'Your free gift has been added to your cart.';
    case 'free_shipping':
      return 'Free shipping applied to your cart.';
    default:
      return value
        ? `${value} applied to your cart.`
        : 'Your reward has been applied to your cart.';
  }
};

/**
 * Redeem a Rivo reward and apply the result to the Hydrogen cart.
 *
 * Rivo redemptions produce standard Shopify discount codes, so the flow is:
 * redeem server-side → receive `points_purchase.code` → apply it with
 * `cartDiscountCodesUpdate`. Free-product rewards additionally add the free
 * variant with `cartLinesAdd`. Gift-card and store-credit rewards touch the
 * cart not at all — Shopify settles those at checkout.
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
  const {discountCodes, discountCodesUpdate, linesAdd} = useCart();
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
      rewardId,
      points,
      credits,
    }: RedeemArgs): Promise<RivoRedeemResult> => {
      const fail = (error: string) => {
        const failure = {redemption: null, message: null, error};
        setResult(failure);
        return failure;
      };

      setIsRedeeming(true);
      setResult({redemption: null, message: null, error: null});

      try {
        const id = rewardId ?? reward?.id;
        const formData = new FormData();
        formData.append('action', 'spendPoints');
        if (id) formData.append('rewardId', String(id));
        if (points) formData.append('points', String(points));
        if (credits) formData.append('credits', String(credits));
        // Fallback for free-product rewards whose variants live on the reward
        // config rather than on the redemption response.
        if (reward?.variant_ids?.length) {
          formData.append('variantIds', JSON.stringify(reward.variant_ids));
        }

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

        // Points are already spent at this point. Cart failures below are
        // reported with the code so the customer can still apply it manually.
        if (redemption.cartStrategy !== 'none' && redemption.code) {
          const existingCodes = ((discountCodes || []) as CartDiscountCode[])
            .map(({code}) => code)
            .filter(Boolean) as string[];

          if (existingCodes.includes(redemption.code)) {
            const message = buildMessage(redemption);
            const success = {redemption, message, error: null};
            setResult(success);
            onSuccess?.(redemption);
            return success;
          }

          if (existingCodes.length >= MAX_DISCOUNT_CODES) {
            return fail(
              `Your reward code is ${redemption.code}, but your cart already has the maximum of ${MAX_DISCOUNT_CODES} discount codes. Remove one and apply it manually.`,
            );
          }

          if (redemption.cartStrategy === 'discount_code_and_line') {
            // Add the free variant first so the discount has a line to apply to.
            await linesAdd(
              redemption.variantIds.map((merchandiseId) => ({
                merchandiseId,
                quantity: 1,
              })),
            );
          }

          const cartData = await discountCodesUpdate([
            ...existingCodes,
            redemption.code,
          ]);

          const userError = cartData?.userErrors?.[0]?.message;
          if (userError) {
            return fail(
              `Your reward code is ${redemption.code}, but it couldn't be applied: ${userError}`,
            );
          }

          const applied = (
            (cartData?.cart?.discountCodes || []) as CartDiscountCode[]
          ).find(({code}) => code === redemption.code);

          if (applied && applied.applicable === false) {
            return fail(
              `Your reward code is ${redemption.code}, but it isn't applicable to the items in your cart yet.`,
            );
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
    [discountCodes, discountCodesUpdate, linesAdd, onSuccess, pathPrefix],
  );

  return {redeem, isRedeeming, result, reset};
}
