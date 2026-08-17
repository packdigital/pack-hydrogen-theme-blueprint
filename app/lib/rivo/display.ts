import type {createWithCache} from '@shopify/hydrogen';

import {
  getCartStrategy,
  isClaimableTrigger,
  rivoRequest,
  toNumber,
  toTierName,
  toVariantGid,
  unwrapCollection,
  unwrapSingle,
} from './rivo-client';
import type {
  RivoCustomer,
  RivoEarningRule,
  RivoEnv,
  RivoLedgerEntry,
  RivoLoyaltySummary,
  RivoRawCollection,
  RivoRawCustomer,
  RivoRawEarningRule,
  RivoRawPointsEvent,
  RivoRawPointsRedemption,
  RivoRawReferral,
  RivoRawReward,
  RivoRawSingle,
  RivoRawVipTier,
  RivoReferral,
  RivoReferralStats,
  RivoResult,
  RivoReward,
  RivoRewardType,
  RivoUnusedReward,
  RivoVipTier,
} from './rivo.types';

interface CustomerScopedProps {
  env: RivoEnv;
  customerId: string;
  limit?: number;
  page?: number;
  /** Only used by `getEarningRules`; accepted by all so the route can dispatch uniformly. */
  completedIds?: (number | string)[];
  /**
   * Hydrogen's subrequest cache, from `context.withCache`.
   *
   * Only the shop-scoped reads use it — the program config is identical for
   * every visitor and changes only when the merchant edits it, so caching it
   * removes most of the per-view load on Rivo's 15 req/s budget.
   *
   * Customer-scoped reads are deliberately **not** cached. Points and tier move
   * the instant someone redeems or earns, and serving a stale balance next to a
   * Redeem button is worse than the extra call.
   */
  withCache?: RivoWithCache;
}

/**
 * Hydrogen's own cache type. Duplicating its shape here fails structurally —
 * `addDebugData` is contravariant — so the real one is imported.
 */
export type RivoWithCache = ReturnType<typeof createWithCache>;

/** Program config changes only when the merchant edits it. */
const SHOP_CACHE_STRATEGY = {maxAge: 60, staleWhileRevalidate: 600};

/**
 * Run a shop-scoped read through the subrequest cache when one is available.
 *
 * Errors are never cached — a rate-limited or timed-out response must not be
 * pinned for the next 60 seconds.
 */
const cachedShopRead = <TData>(
  withCache: RivoWithCache | undefined,
  cacheKey: readonly unknown[],
  fn: () => Promise<RivoResult<TData>>,
) => {
  if (!withCache) return fn();
  return withCache.run(
    {
      cacheKey: ['rivo', ...cacheKey],
      cacheStrategy: SHOP_CACHE_STRATEGY,
      shouldCacheResult: (result: RivoResult<TData>) => !result.error,
    },
    fn,
  );
};

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
    completedEarningRuleIds: raw.completed_earning_rule_ids || [],
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
  // `points_diff` is the *signed* delta; `points_amount` is only its magnitude,
  // so a redemption reports `points_amount: 100, points_diff: -100`. Reading
  // `points_amount` alone renders every spend as a gain.
  amount:
    raw.points_diff !== null && raw.points_diff !== undefined
      ? toNumber(raw.points_diff)
      : raw.points_amount === null || raw.points_amount === undefined
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

const normalizeEarningRule = (
  raw: RivoRawEarningRule,
  completed: Set<string>,
): RivoEarningRule => {
  const isMultiplier = raw.points_type === 'multiplier';
  const points =
    raw.points_amount === null || raw.points_amount === undefined
      ? null
      : toNumber(raw.points_amount);
  const base = toNumber(raw.currency_base_amount, 1) || 1;

  return {
    id: raw.id ?? '',
    title: raw.title || raw.name || 'Earn points',
    description: raw.description || null,
    trigger: raw.trigger || null,
    pointsAmount: points,
    isMultiplier,
    currencyBaseAmount: base,
    // Rivo's `pretty_earnings_text` renders a multiplier as "1 Points", which
    // reads as a flat award. Spell the rate out instead.
    earningsText: isMultiplier
      ? points === null
        ? null
        : `${points.toLocaleString()} ${points === 1 ? 'point' : 'points'} per $${base}`
      : raw.pretty_earnings_text ||
        (points === null ? null : `${points.toLocaleString()} points`),
    url: raw.url || null,
    buttonText: raw.button_text || null,
    customActionName: raw.custom_action_name || null,
    isCompleted: completed.has(String(raw.id)),
    isClaimable: isClaimableTrigger(raw.trigger),
  };
};

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
  withCache,
}: CustomerScopedProps): Promise<RivoResult<RivoReward[]>> =>
  cachedShopRead(withCache, ['rewards'], async () => {
    const result = await rivoRequest<RivoRawCollection<RivoRawReward>>({
      env,
      path: '/rewards',
      searchParams: {pagination: {per_page: 100}},
    });
    const rewards = unwrapCollection(result.data)
      .filter((raw) => raw.enabled !== false && raw.source === 'points')
      .map(normalizeReward);
    return {...result, data: rewards};
  });

/**
 * `GET /earning_rules` — the "ways to earn" actions.
 *
 * Rules with no title are dropped: Rivo returns partially-null rows for rules
 * that exist but aren't configured. `hidden_from_ui` and inactive rules are
 * dropped too. Pass `completedIds` to mark what the customer has already done.
 */
export const getEarningRules = async ({
  env,
  completedIds = [],
  withCache,
}: CustomerScopedProps): Promise<RivoResult<RivoEarningRule[]>> => {
  // The rules themselves are shop-scoped and cacheable; only the per-customer
  // completion marking is not, so that is applied after the cached read.
  const cached = await cachedShopRead(
    withCache,
    ['earning_rules'],
    async () => {
      const result = await rivoRequest<RivoRawCollection<RivoRawEarningRule>>({
        env,
        path: '/earning_rules',
        searchParams: {pagination: {per_page: 100}},
      });
      const raw = unwrapCollection(result.data).filter(
        (rule) =>
          !!rule.title && !rule.hidden_from_ui && rule.status !== 'disabled',
      );
      return {...result, data: raw};
    },
  );

  const completed = new Set(completedIds.map(String));
  return {
    ...cached,
    data: (cached.data || []).map((raw) =>
      normalizeEarningRule(raw, completed),
    ),
  };
};

/** `GET /vip_tiers` — the program's VIP tier ladder, ascending by threshold. */
export const getVipTiers = async ({
  env,
  withCache,
}: CustomerScopedProps): Promise<RivoResult<RivoVipTier[]>> =>
  cachedShopRead(withCache, ['vip_tiers'], async () => {
    const result = await rivoRequest<RivoRawCollection<RivoRawVipTier>>({
      env,
      path: '/vip_tiers',
    });
    const tiers = unwrapCollection(result.data)
      .map(normalizeVipTier)
      .sort((a, b) => (a.threshold ?? 0) - (b.threshold ?? 0));
    return {...result, data: tiers};
  });

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

/**
 * `GET /points_redemptions` — rewards the customer has paid points for but not
 * used yet.
 *
 * Points are deducted the instant a redemption is created, so a code whose cart
 * application failed is still owed to the customer. Without surfacing these, a
 * failed apply silently destroys a paid-for reward.
 *
 * Excludes anything consumed (`used_at`), reversed (`refunded_at`,
 * `revoked_at`), or expired. Note the API returns `used_at`, not the boolean
 * `used` the docs list.
 */
export const getUnusedRewards = async ({
  env,
  customerId,
  limit = 25,
}: CustomerScopedProps): Promise<RivoResult<RivoUnusedReward[]>> => {
  const result = await rivoRequest<RivoRawCollection<RivoRawPointsRedemption>>({
    env,
    path: '/points_redemptions',
    searchParams: {
      filters: {customer_identifier: customerId},
      pagination: {per_page: limit},
    },
  });

  const now = Date.now();
  const rewards = unwrapCollection(result.data)
    .filter((raw) => {
      if (!raw.code) return false;
      if (raw.used_at || raw.refunded_at || raw.revoked_at) return false;
      if (raw.expires_at && new Date(raw.expires_at).getTime() < now)
        return false;
      return true;
    })
    .map((raw) => {
      const rewardType = (raw.reward?.reward_type as RivoRewardType) || null;
      const cartStrategy = getCartStrategy(rewardType);
      const variantIds = (
        raw.variant_ids?.length
          ? raw.variant_ids
          : raw.reward?.variant_ids || []
      )
        .filter(Boolean)
        .map(toVariantGid);

      return {
        id: raw.id ?? null,
        code: raw.code as string,
        name: raw.name || raw.reward?.name || null,
        pointsSpent:
          raw.points_amount === null || raw.points_amount === undefined
            ? null
            : toNumber(raw.points_amount),
        creditsSpent:
          raw.credits_amount === null || raw.credits_amount === undefined
            ? null
            : toNumber(raw.credits_amount),
        appliedAt: raw.applied_at || null,
        expiresAt: raw.expires_at || null,
        rewardType,
        // A free-product reward with no variant degrades to code-only, matching
        // how a fresh redemption is handled.
        cartStrategy:
          cartStrategy === 'discount_code_and_line' && !variantIds.length
            ? 'discount_code'
            : cartStrategy,
        variantIds,
      };
    })
    // Newest first.
    .sort(
      (a, b) =>
        new Date(b.appliedAt || 0).getTime() -
        new Date(a.appliedAt || 0).getTime(),
    );

  return {...result, data: rewards};
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
 * Point a referral link at the Hydrogen storefront.
 *
 * Rivo builds `referral_url` from the shop's myshopify domain. On a headless
 * setup that domain serves the Liquid online store, so a friend following the
 * link lands somewhere the referral-capture hook does not run and the referral is
 * never attributed. Rewriting the origin to `PRIMARY_DOMAIN` keeps the code and
 * path intact while sending them to the storefront that can actually record it.
 */
export const toStorefrontReferralUrl = (
  referralUrl: string | null,
  primaryDomain?: string,
) => {
  if (!referralUrl || !primaryDomain) return referralUrl;
  try {
    const target = new URL(referralUrl);
    const origin = new URL(primaryDomain);
    target.protocol = origin.protocol;
    target.host = origin.host;
    return target.toString();
  } catch (error) {
    // A malformed value from either side shouldn't break the section.
    return referralUrl;
  }
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
      referralUrl: toStorefrontReferralUrl(
        customer.data.referralUrl,
        env.PRIMARY_DOMAIN,
      ),
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
  withCache,
}: CustomerScopedProps): Promise<RivoResult<RivoLoyaltySummary>> => {
  const [customer, rewards, vipTiers] = await Promise.all([
    getCustomer({env, customerId}),
    getRewards({env, customerId, withCache}),
    getVipTiers({env, customerId, withCache}),
  ]);

  if (!customer.data) {
    return {status: customer.status, data: null, error: customer.error};
  }

  // Sequenced after the customer so completed rules can be marked.
  const earningRules = await getEarningRules({
    env,
    customerId,
    completedIds: customer.data.completedEarningRuleIds,
    withCache,
  });

  return {
    status: 200,
    error: null,
    data: {
      customer: customer.data,
      rewards: rewards.data || [],
      vipTiers: vipTiers.data || [],
      earningRules: earningRules.data || [],
    },
  };
};
