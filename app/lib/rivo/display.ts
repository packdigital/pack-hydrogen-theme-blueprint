import {rivoRequest} from './rivo-client';
import type {
  RivoCustomerProperties,
  RivoCustomerStatus,
  RivoEnv,
  RivoLedgerEntry,
  RivoLoyaltySummary,
  RivoReferral,
  RivoReferralStats,
  RivoResult,
  RivoReward,
  RivoVipTier,
} from './rivo.types';

interface CustomerScopedProps {
  env: RivoEnv;
  customerId: string;
  limit?: number;
  page?: number;
}

/**
 * Rivo wraps collections inconsistently — sometimes a bare array, sometimes
 * `{data: []}` or a named key. Pull the array out wherever it is.
 */
const unwrapCollection = <TItem>(
  payload: unknown,
  ...keys: string[]
): TItem[] => {
  if (Array.isArray(payload)) return payload as TItem[];
  if (!payload || typeof payload !== 'object') return [];
  const record = payload as Record<string, unknown>;
  for (const key of [...keys, 'data', 'results', 'items']) {
    if (Array.isArray(record[key])) return record[key] as TItem[];
  }
  return [];
};

/** `GET /api/customers/:customer_id/status` — loyalty status and points. */
export const getCustomerStatus = async ({
  env,
  customerId,
}: CustomerScopedProps): Promise<RivoResult<RivoCustomerStatus>> => {
  const result = await rivoRequest<Record<string, any>>({
    env,
    path: `/api/customers/${customerId}/status`,
  });
  // Some Rivo responses nest the customer under `customer`.
  const data = (result.data?.customer ||
    result.data) as RivoCustomerStatus | null;
  return {...result, data};
};

/**
 * `GET /api/customers/:customer_id/properties` — points plus the customer's
 * available unused reward (`loy_unused_reward.code`).
 */
export const getCustomerProperties = async ({
  env,
  customerId,
}: CustomerScopedProps): Promise<RivoResult<RivoCustomerProperties>> => {
  return rivoRequest<RivoCustomerProperties>({
    env,
    path: `/api/customers/${customerId}/properties`,
  });
};

/** `GET /api/customers/:customer_id/vip_tiers` — the program's VIP tiers. */
export const getVipTiers = async ({
  env,
  customerId,
}: CustomerScopedProps): Promise<RivoResult<RivoVipTier[]>> => {
  const result = await rivoRequest<unknown>({
    env,
    path: `/api/customers/${customerId}/vip_tiers`,
  });
  return {
    ...result,
    data: unwrapCollection<RivoVipTier>(result.data, 'vip_tiers'),
  };
};

/** `GET /api/customers/:customer_id/points_logs` — points history. */
export const getPointsLogs = async ({
  env,
  customerId,
  limit,
  page,
}: CustomerScopedProps): Promise<RivoResult<RivoLedgerEntry[]>> => {
  const result = await rivoRequest<unknown>({
    env,
    path: `/api/customers/${customerId}/points_logs`,
    searchParams: {limit, page},
  });
  return {
    ...result,
    data: unwrapCollection<RivoLedgerEntry>(
      result.data,
      'points_logs',
      'logs',
      'points_events',
    ),
  };
};

/** `GET /api/customers/:customer_id/credits_logs` — store-credit history. */
export const getCreditsLogs = async ({
  env,
  customerId,
  limit,
  page,
}: CustomerScopedProps): Promise<RivoResult<RivoLedgerEntry[]>> => {
  const result = await rivoRequest<unknown>({
    env,
    path: `/api/customers/${customerId}/credits_logs`,
    searchParams: {limit, page},
  });
  return {
    ...result,
    data: unwrapCollection<RivoLedgerEntry>(
      result.data,
      'credits_logs',
      'logs',
      'credits_events',
    ),
  };
};

/** `GET /api/customers/:customer_id/referrals` — the customer's referrals. */
export const getReferrals = async ({
  env,
  customerId,
}: CustomerScopedProps): Promise<RivoResult<RivoReferral[]>> => {
  const result = await rivoRequest<unknown>({
    env,
    path: `/api/customers/${customerId}/referrals`,
  });
  return {
    ...result,
    data: unwrapCollection<RivoReferral>(result.data, 'referrals'),
  };
};

/** `GET /api/customers/:customer_id/referral_stats` — referral link + stats. */
export const getReferralStats = async ({
  env,
  customerId,
}: CustomerScopedProps): Promise<RivoResult<RivoReferralStats>> => {
  const result = await rivoRequest<Record<string, any>>({
    env,
    path: `/api/customers/${customerId}/referral_stats`,
  });
  const data = (result.data?.referral_stats ||
    result.data) as RivoReferralStats | null;
  return {...result, data};
};

/**
 * `GET /api/rewards` — the shop's rewards catalog.
 *
 * Unlike the other endpoints this one is shop-scoped, not customer-scoped
 * (`/api/customers/:id/rewards` does not exist — it 404s). Affordability is
 * therefore computed client-side against the customer's points tally.
 */
export const getRewards = async ({
  env,
}: CustomerScopedProps): Promise<RivoResult<RivoReward[]>> => {
  const result = await rivoRequest<unknown>({env, path: '/api/rewards'});
  return {
    ...result,
    data: unwrapCollection<RivoReward>(result.data, 'rewards'),
  };
};

/**
 * Everything the loyalty sections need, in one round trip. Individual failures
 * degrade to `null`/`[]` rather than failing the whole page.
 */
export const getLoyaltySummary = async ({
  env,
  customerId,
}: CustomerScopedProps): Promise<RivoResult<RivoLoyaltySummary>> => {
  const [status, properties, vipTiers, rewards] = await Promise.all([
    getCustomerStatus({env, customerId}),
    getCustomerProperties({env, customerId}),
    getVipTiers({env, customerId}),
    getRewards({env, customerId}),
  ]);

  const errors = [status.error, properties.error].filter(Boolean);

  return {
    // Only fail hard if neither of the two core calls came back.
    status: status.data || properties.data ? 200 : status.status,
    data: {
      status: status.data,
      properties: properties.data,
      vipTiers: vipTiers.data || [],
      rewards: rewards.data || [],
    },
    error: status.data || properties.data ? null : errors.join(' | ') || null,
  };
};
