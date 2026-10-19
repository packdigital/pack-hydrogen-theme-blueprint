import {
  getCartStrategy,
  rivoRequest,
  toVariantGid,
  unwrapSingle,
} from './rivo-client';
import type {
  RivoEnv,
  RivoRawPointsRedemption,
  RivoRawSingle,
  RivoRedemption,
  RivoResult,
  RivoReward,
  RivoRewardType,
} from './rivo.types';

interface RedeemRewardProps {
  env: RivoEnv;
  /** Shopify customer id, from the authenticated session. */
  customerId: string;
  /** The Rivo reward id being redeemed. */
  rewardId: string | number;
  /** Incremental points reward: how many points to spend. */
  pointsAmount?: number | null;
  /** Incremental credits reward: how many credits to spend. */
  creditsAmount?: number | null;
  /**
   * Reward metadata used to fill gaps in the redemption response — notably the
   * free-product variant ids and the reward type, which Rivo does not always
   * echo back on create.
   */
  reward?: Pick<RivoReward, 'name' | 'rewardType' | 'variantIds'> | null;
}

/**
 * `POST /points_redemptions` — redeem a reward for points.
 *
 * Rivo deducts the points and generates a Shopify discount code, returned at
 * `code`. The result is normalized into a {@link RivoRedemption} telling the
 * storefront which cart mutations to run.
 *
 * Request is `application/x-www-form-urlencoded` (Rivo's documented format):
 * `customer_identifier`, `reward_id`, and optionally `points_amount` /
 * `credits_amount` for incremental rewards.
 */
export const redeemReward = async ({
  env,
  customerId,
  rewardId,
  pointsAmount,
  creditsAmount,
  reward,
}: RedeemRewardProps): Promise<RivoResult<RivoRedemption>> => {
  if (!rewardId) {
    return {
      status: 400,
      data: null,
      error: 'Rivo: `rewardId` is required to redeem a reward.',
    };
  }

  const result = await rivoRequest<
    RivoRawSingle<RivoRawPointsRedemption> & RivoRawPointsRedemption
  >({
    env,
    path: '/points_redemptions',
    method: 'POST',
    body: {
      customer_identifier: customerId,
      reward_id: rewardId,
      points_amount: pointsAmount ?? undefined,
      credits_amount: creditsAmount ?? undefined,
    },
  });

  if (result.error) {
    return {status: result.status, data: null, error: result.error};
  }

  // Create responses are documented as 201 but not shape-documented, so accept
  // either a JSON:API envelope or a bare attributes object.
  const raw =
    unwrapSingle(result.data) ||
    (result.data as RivoRawPointsRedemption | null);

  if (!raw) {
    return {
      status: 502,
      data: null,
      error: 'Rivo: redemption returned an empty response.',
    };
  }

  const rewardType =
    (raw.reward_type as RivoRewardType) || reward?.rewardType || null;
  const cartStrategy = getCartStrategy(rewardType);
  const code = raw.code || null;

  if (cartStrategy !== 'none' && !code) {
    return {
      status: 502,
      data: null,
      error:
        'Rivo: redemption succeeded but no discount code was returned. Check the customer’s reward history in Rivo before retrying, so points are not spent twice.',
    };
  }

  const variantIds = (
    raw.variant_ids?.length ? raw.variant_ids : reward?.variantIds || []
  )
    .filter(Boolean)
    .map(toVariantGid);

  return {
    status: 200,
    error: null,
    data: {
      id: raw.id ?? null,
      code,
      rewardType,
      rewardName: reward?.name || null,
      pointsSpent:
        typeof raw.points_diff === 'number'
          ? Math.abs(raw.points_diff)
          : typeof raw.points_amount === 'number'
            ? raw.points_amount
            : (pointsAmount ?? null),
      formattedStoreCreditAmount: raw.formatted_store_credit_amount || null,
      // A free-product reward with no variant to add degrades to code-only
      // rather than leaving the caller waiting on an empty cartLinesAdd.
      cartStrategy:
        cartStrategy === 'discount_code_and_line' && !variantIds.length
          ? 'discount_code'
          : cartStrategy,
      variantIds,
    },
  };
};
