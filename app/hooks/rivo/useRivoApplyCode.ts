import {useCallback} from 'react';
import type {CartDiscountCode} from '@shopify/hydrogen/storefront-api-types';

import {useCart} from '~/hooks';
import type {RivoCartStrategy} from '~/lib/rivo';

/** Shopify applies at most 5 discount codes per order. */
export const MAX_DISCOUNT_CODES = 5;

export interface RivoApplyResult {
  /** True when the code is on the cart (or was already). */
  applied: boolean;
  error: string | null;
}

interface ApplyArgs {
  code: string;
  cartStrategy: RivoCartStrategy;
  /** Shopify variant GIDs to add for a free-product reward. */
  variantIds?: string[];
}

/**
 * Apply a Rivo-issued discount code to the Hydrogen cart.
 *
 * Shared by {@link useRivoRedeem} (fresh redemption) and the unused-rewards list
 * (re-applying a code that was already paid for), so the two paths cannot drift.
 * Every failure message names the code, because the points behind it are already
 * spent and the customer needs it to apply the reward by hand.
 */
export function useRivoApplyCode() {
  const {discountCodes, discountCodesUpdate, linesAdd} = useCart();

  const applyCode = useCallback(
    async ({
      code,
      cartStrategy,
      variantIds = [],
    }: ApplyArgs): Promise<RivoApplyResult> => {
      // Gift cards and store credit are settled by Shopify at checkout.
      if (cartStrategy === 'none') return {applied: false, error: null};

      const existingCodes = ((discountCodes || []) as CartDiscountCode[])
        .map(({code: existing}) => existing)
        .filter(Boolean) as string[];

      if (existingCodes.includes(code)) return {applied: true, error: null};

      if (existingCodes.length >= MAX_DISCOUNT_CODES) {
        return {
          applied: false,
          error: `Your reward code is ${code}, but your cart already has the maximum of ${MAX_DISCOUNT_CODES} discount codes. Remove one and apply it manually.`,
        };
      }

      try {
        if (cartStrategy === 'discount_code_and_line' && variantIds.length) {
          // Add the free variant first so the discount has a line to apply to.
          await linesAdd(
            variantIds.map((merchandiseId) => ({merchandiseId, quantity: 1})),
          );
        }

        const cartData = await discountCodesUpdate([...existingCodes, code]);

        const userError = cartData?.userErrors?.[0]?.message;
        if (userError) {
          return {
            applied: false,
            error: `Your reward code is ${code}, but it couldn't be applied: ${userError}`,
          };
        }

        const applied = (
          (cartData?.cart?.discountCodes || []) as CartDiscountCode[]
        ).find(({code: applying}) => applying === code);

        if (applied && applied.applicable === false) {
          return {
            applied: false,
            error: `Your reward code is ${code}, but it isn't applicable to the items in your cart yet.`,
          };
        }

        return {applied: true, error: null};
      } catch (error) {
        console.error('useRivoApplyCode:error:', error);
        return {
          applied: false,
          error: `Your reward code is ${code}, but applying it failed. Try again, or enter it at checkout.`,
        };
      }
    },
    [discountCodes, discountCodesUpdate, linesAdd],
  );

  return {applyCode};
}
