import {
  rivoRequest,
  toNumber,
  toTierName,
  unwrapCollection,
  unwrapSingle,
} from './rivo-client';
import type {
  RivoCustomer,
  RivoEnv,
  RivoLedgerEntry,
  RivoLoyaltySummary,
  RivoRawCollection,
  RivoRawCustomer,
  RivoRawPointsEvent,
  RivoRawReferral,
  RivoRawReward,
  RivoRawSingle,
  RivoRawVipTier,
  RivoReferral,
  RivoReferralStats,
  RivoResult,
  RivoReward,
  RivoRewardType,
  RivoVipTier,
} from './rivo.types';

interface CustomerScopedProps {
  env: RivoEnv;
  customerId: string;
  limit?: number;
  page?: number;
}

/* Normalizers ---------- */

const normalizeCustomer = (raw: RivoRawCustomer): RivoCustomer => {
  const nextTier = raw.next_vip_tier;
  return {
    id: raw.id ?? null,
    email: raw.email || null,
    firstName: raw.first_name || null,
    lastName: raw.last_name || null,
    loyaltyStatus: raw.loyalty_status || null,
    pointsTally: toNumber(raw.points_tally),
    creditsTally: toNumber(raw.credits_tally),
    lifetimeEarningsTally:
      raw.lifetime_earnings_tally === null ||
      raw.lifetime_earnings_tally === undefined
        ? null
        : toNumber(raw.lifetime_earnings_tally),
    vipTierName: toTierName(raw.vip_tier),
    nextVipTierName: toTierName(nextTier),
    nextVipTierThreshold:
      nextTier && typeof nextTier === 'object' && nextTier.threshold != null
        ? toNumber(nextTier.threshold)
        : null,
    referralUrl: raw.referral_url || null,
    referralCode: raw.referral_code || null,
    pointsExpireAt: raw.points_expire_at || null,
  };
};

const normalizeReward = (raw: RivoRawReward): RivoReward => ({
  id: raw.id ?? '',
  name: raw.name || 'Reward',
  // `pretty_display_rewards` reads like "$5 off coupon (100 points required)",
  // which duplicates the name and points shown in the UI, so it's not used as
  // the description.
  description: null,
  enabled: raw.enabled !== false,
  rewardType: (raw.reward_type as RivoRewardType) || null,
  pointsAmount:
    raw.points_amount === null || raw.points_amount === undefined
      ? null
      : toNumber(raw.points_amount),
  // Rivo marks a set price as `points_type: 'fixed'`; anything else lets the
  // customer choose how many points to spend.
  isIncremental: !!raw.points_type && raw.points_type !== 'fixed',
  rewardValue:
    raw.reward_value === null || raw.reward_value === undefined
      ? null
      : toNumber(raw.reward_value),
  iconUrl: raw.icon_url || null,
  productId: raw.product_id ?? null,
  variantIds: raw.variant_ids || [],
  minOrderValueInCents:
    raw.min_order_value_in_cents === null ||
    raw.min_order_value_in_cents === undefined
      ? null
      : toNumber(raw.min_order_value_in_cents),
});

const normalizeVipTier = (raw: RivoRawVipTier): RivoVipTier => ({
  id: raw.id ?? null,
  name: raw.name || null,
  threshold:
    raw.threshold === null || raw.threshold === undefined
      ? null
      : toNumber(raw.threshold),
  iconUrl: raw.icon_url || null,
  perks: raw.perks || [],
});

const normalizePointsEvent = (raw: RivoRawPointsEvent): RivoLedgerEntry => ({
  // `unwrapCollection` has already preferred the scalar resource id over the
  // composite `[shop_id, event_id]` attribute.
  id: Array.isArray(raw.id)
    ? (raw.id[raw.id.length - 1] ?? null)
    : (raw.id ?? null),
  amount:
    raw.points_amount === null || raw.points_amount === undefined
      ? null
      : toNumber(raw.points_amount),
  creditsAmount:
    raw.credits_amount === null || raw.credits_amount === undefined
      ? null
      : toNumber(raw.credits_amount),
  source: raw.source || null,
  // Only customer-facing copy: `internal_note` carries operator identity.
  note: raw.title || raw.external_note || null,
  appliedAt: raw.applied_at || raw.approved_at || raw.created_at || null,
  expiresAt: raw.expires_at || raw.per_event_expiration_at || null,
});

const normalizeReferral = (raw: RivoRawReferral): RivoReferral => ({
  id: raw.id ?? null,
  status: raw.status || null,
  referredEmail: raw.referred_email || null,
  completedAt: raw.completed_at || null,
  createdAt: raw.created_at || null,
});

/* Endpoints ---------- */

/**
 * `GET /customers/:customer_identifier` — loyalty status, points, credits, VIP
 * tier and referral link. This one call backs most of the loyalty UI.
 */
export const getCustomer = async ({
  env,
  customerId,
}: CustomerScopedProps): Promise<RivoResult<RivoCustomer>> => {
  const result = await rivoRequest<RivoRawSingle<RivoRawCustomer>>({
    env,
    path: `/customers/${customerId}`,
  });
  const raw = unwrapSingle(result.data);
  return {...result, data: raw ? normalizeCustomer(raw) : null};
};

/**
 * `GET /rewards` — the shop's rewards catalog (shop-scoped, not per customer).
 *
 * Filtered to enabled, points-sourced rewards: `source: 'referrer'` rewards are
 * granted automatically by Rivo and are not customer-redeemable.
 */
export const getRewards = async ({
  env,
}: CustomerScopedProps): Promise<RivoResult<RivoReward[]>> => {
  const result = await rivoRequest<RivoRawCollection<RivoRawReward>>({
    env,
    path: '/rewards',
    searchParams: {pagination: {per_page: 100}},
  });
  const rewards = unwrapCollection(result.data)
    .filter((raw) => raw.enabled !== false && raw.source === 'points')
    .map(normalizeReward);
  return {...result, data: rewards};
};

/** `GET /vip_tiers` — the program's VIP tier ladder, ascending by threshold. */
export const getVipTiers = async ({
  env,
}: CustomerScopedProps): Promise<RivoResult<RivoVipTier[]>> => {
  const result = await rivoRequest<RivoRawCollection<RivoRawVipTier>>({
    env,
    path: '/vip_tiers',
  });
  const tiers = unwrapCollection(result.data)
    .map(normalizeVipTier)
    .sort((a, b) => (a.threshold ?? 0) - (b.threshold ?? 0));
  return {...result, data: tiers};
};

/**
 * `GET /points_events` — the customer's loyalty ledger.
 *
 * This covers credits as well as points: a store-credit grant comes back as a
 * points_event with `points_amount: 0` and a non-zero `credits_amount`. There is
 * no separate credits endpoint (`/credits_events` and `/credits_logs` both 404).
 *
 * Revoked and hidden events are dropped — Rivo reverses events rather than
 * deleting them, and showing a reversed grant to the customer would be wrong.
 * Events with no points *and* no credits movement are dropped too, since they
 * would render as a meaningless "0" row.
 */
export const getPointsLogs = async ({
  env,
  customerId,
  limit = 25,
  page,
}: CustomerScopedProps): Promise<RivoResult<RivoLedgerEntry[]>> => {
  const result = await rivoRequest<RivoRawCollection<RivoRawPointsEvent>>({
    env,
    path: '/points_events',
    searchParams: {
      filters: {customer_identifier: customerId},
      pagination: {per_page: limit, page},
    },
  });
  const entries = unwrapCollection(result.data)
    .filter((raw) => !raw.revoked_at && !raw.hidden)
    .map(normalizePointsEvent)
    .filter(({amount, creditsAmount}) => !!amount || !!creditsAmount);
  return {...result, data: entries};
};

/** `GET /referrals` — the customer's referrals as the advocate. */
export const getReferrals = async ({
  env,
  customerId,
  limit = 25,
}: CustomerScopedProps): Promise<RivoResult<RivoReferral[]>> => {
  const result = await rivoRequest<RivoRawCollection<RivoRawReferral>>({
    env,
    path: '/referrals',
    searchParams: {
      filters: {customer_identifier: customerId},
      pagination: {per_page: limit},
    },
  });
  return {
    ...result,
    data: unwrapCollection(result.data).map(normalizeReferral),
  };
};

/**
 * Referral link plus counts.
 *
 * There is no single stats endpoint on this surface — `/customers/:id/advocate_stats`
 * returns the plain customer object — so the link comes from the customer and
 * the counts are derived from `/referrals`.
 */
export const getReferralStats = async ({
  env,
  customerId,
}: CustomerScopedProps): Promise<RivoResult<RivoReferralStats>> => {
  const [customer, referrals] = await Promise.all([
    getCustomer({env, customerId}),
    getReferrals({env, customerId, limit: 100}),
  ]);

  if (!customer.data) {
    return {status: customer.status, data: null, error: customer.error};
  }

  const all = referrals.data || [];
  const completedCount = all.filter(
    ({status, completedAt}) => !!completedAt || status === 'completed',
  ).length;

  return {
    status: 200,
    error: null,
    data: {
      referralUrl: customer.data.referralUrl,
      referralCode: customer.data.referralCode,
      completedCount,
      pendingCount: all.length - completedCount,
      totalCount: all.length,
    },
  };
};

/**
 * Everything the loyalty sections need, in one round trip. The rewards and tier
 * calls degrade to `[]` rather than failing the page; only the customer lookup
 * is load-bearing.
 */
export const getLoyaltySummary = async ({
  env,
  customerId,
}: CustomerScopedProps): Promise<RivoResult<RivoLoyaltySummary>> => {
  const [customer, rewards, vipTiers] = await Promise.all([
    getCustomer({env, customerId}),
    getRewards({env, customerId}),
    getVipTiers({env, customerId}),
  ]);

  if (!customer.data) {
    return {status: customer.status, data: null, error: customer.error};
  }

  return {
    status: 200,
    error: null,
    data: {
      customer: customer.data,
      rewards: rewards.data || [],
      vipTiers: vipTiers.data || [],
    },
  };
};
