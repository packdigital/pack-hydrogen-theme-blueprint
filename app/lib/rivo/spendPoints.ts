import {
  getCartStrategy,
  getRedemptionVariantGids,
  rivoRequest,
} from './rivo-client';
import type {
  RivoEnv,
  RivoRedemption,
  RivoResult,
  RivoSpendPointsResponse,
} from './rivo.types';

interface SpendPointsProps {
  env: RivoEnv;
  customerId: string;
  /**
   * Fixed reward: the Reward's **id**. The Rivo param is literally named
   * `reward_name` but its value is the reward id.
   */
  rewardId?: string | null;
  /** Incremental / custom reward: amount of points to redeem. */
  points?: number | null;
  /** Incremental / custom reward: amount of credits to redeem. */
  credits?: number | null;
  /** Free-product reward variant ids from the reward config, used as a fallback. */
  fallbackVariantIds?: (number | string)[] | null;
}

const collectErrors = (data: RivoSpendPointsResponse | null) => {
  if (!data) return null;
  if (data.error) return data.error;
  if (Array.isArray(data.errors) && data.errors.length)
    return data.errors.join(', ');
  if (data.errors && typeof data.errors === 'object') {
    const messages = Object.entries(data.errors).flatMap(([field, value]) =>
      (Array.isArray(value) ? value : [value]).map((msg) => `${field} ${msg}`),
    );
    if (messages.length) return messages.join(', ');
  }
  if (data.success === false) return data.message || 'Redemption failed.';
  return null;
};

/**
 * `POST /api/customers/:customer_id/spend_points`
 *
 * Redeems points and returns the generated Shopify discount code at
 * `points_purchase.code`, normalized into a {@link RivoRedemption} that tells
 * the storefront which cart mutations to run.
 */
export const spendPoints = async ({
  env,
  customerId,
  rewardId,
  points,
  credits,
  fallbackVariantIds,
}: SpendPointsProps): Promise<RivoResult<RivoRedemption>> => {
  if (!rewardId && !points && !credits) {
    return {
      status: 400,
      data: null,
      error:
        'Rivo: a redemption needs either `rewardId` (fixed reward) or `points`/`credits` (incremental reward).',
    };
  }

  const body: Record<string, unknown> = {};
  // Fixed rewards: param name is `reward_name`, value is the reward id.
  if (rewardId) body.reward_name = rewardId;
  if (points) body.points = points;
  if (credits) body.credits = credits;

  const result = await rivoRequest<RivoSpendPointsResponse>({
    env,
    path: `/api/customers/${customerId}/spend_points`,
    method: 'POST',
    body,
  });

  if (result.error)
    return {status: result.status, data: null, error: result.error};

  // Rivo returns 200 with `success: false` for program-level rejections
  // (insufficient points, reward disabled, limits hit).
  const bodyError = collectErrors(result.data);
  if (bodyError) {
    return {status: 422, data: null, error: `Rivo: ${bodyError}`};
  }

  const pointsPurchase = result.data?.points_purchase || null;
  const rewardType = pointsPurchase?.reward_type || null;
  const cartStrategy = getCartStrategy(rewardType);
  const code = pointsPurchase?.code || null;

  if (cartStrategy !== 'none' && !code) {
    return {
      status: 502,
      data: null,
      error:
        'Rivo: redemption succeeded but no discount code was returned at `points_purchase.code`.',
    };
  }

  const variantIds = getRedemptionVariantGids(
    pointsPurchase,
    fallbackVariantIds,
  );

  return {
    status: 200,
    error: null,
    data: {
      code,
      rewardType,
      formattedValue: pointsPurchase?.formatted_value || null,
      formattedStoreCreditAmount:
        pointsPurchase?.formatted_store_credit_amount ||
        result.data?.formatted_store_credit_amount ||
        null,
      pointsTally: result.data?.points_tally ?? null,
      creditsTally: result.data?.credits_tally ?? null,
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
