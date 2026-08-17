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
      pointsAmount,
      creditsAmount,
    }: RedeemArgs): Promise<RivoRedeemResult> => {
      const fail = (error: string) => {
        const failure = {redemption: null, message: null, error};
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
