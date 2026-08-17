/*
 * Types for Rivo's customer-facing ("storefront") loyalty API.
 *
 * Base URL: https://loyalty-api.rivo.io
 * Auth: `Authorization: Bearer <RIVO_STOREFRONT_API_KEY>` — server-side only.
 *
 * Rivo's responses are loosely typed on their end (fields come and go with the
 * merchant's program config), so most fields here are optional and the client
 * normalizes what the UI depends on. See `./README.md`.
 */

/* Env ---------- */

export interface RivoEnv {
  PRIVATE_RIVO_STOREFRONT_API_KEY?: string;
  PRIVATE_RIVO_SHOP_DOMAIN?: string;
  PUBLIC_STORE_DOMAIN?: string;
  RIVO_API_BASE_URL?: string;
}

/* Request plumbing ---------- */

export interface RivoRequestOptions {
  env: RivoEnv;
  /** Path after the base URL, e.g. `/api/customers/123/status`. */
  path: string;
  method?: 'GET' | 'POST';
  /** Appended to the query string alongside the required `shop` param. */
  searchParams?: Record<string, string | number | undefined | null>;
  /** JSON body for POST requests. */
  body?: Record<string, unknown>;
  signal?: AbortSignal;
}

export interface RivoResult<TData> {
  status: number;
  data: TData | null;
  error: string | null;
}

/* Reward types ---------- */

export type RivoRewardType =
  | 'fixed_amount'
  | 'percentage'
  | 'free_shipping'
  | 'free_product'
  | 'gift_card'
  | 'points_to_credit';

/**
 * How a redeemed reward is applied to the Hydrogen cart.
 * - `discount_code` — apply via `cartDiscountCodesUpdate`
 * - `discount_code_and_line` — also add the free variant via `cartLinesAdd`
 * - `none` — handled natively by Shopify (gift card / store credit)
 */
export type RivoCartStrategy =
  'discount_code' | 'discount_code_and_line' | 'none';

export interface RivoReward {
  id: number | string;
  title?: string;
  description?: string | null;
  reward_type?: RivoRewardType;
  /** Points required for a fixed reward. */
  points_price?: number | null;
  /** Discount value, e.g. `10` for $10 off or 10% off. */
  value?: number | string | null;
  formatted_value?: string | null;
  /** Present on `free_product` rewards. */
  variant_ids?: (number | string)[] | null;
  image_url?: string | null;
  /** Rivo flags incremental rewards, which take `points`/`credits` instead of a fixed price. */
  incremental?: boolean | null;
  min_points?: number | null;
  max_points?: number | null;
  points_increment?: number | null;
  enabled?: boolean | null;
}

/* Display endpoints ---------- */

/** `GET /api/customers/:customer_id/status` */
export interface RivoCustomerStatus {
  id?: number | string;
  shopify_customer_id?: number | string | null;
  email?: string | null;
  loyalty_status?: string | null;
  points_tally?: number | null;
  credits_tally?: number | null;
  formatted_credits_tally?: string | null;
  lifetime_earnings_tally?: number | null;
  vip_tier_name?: string | null;
  vip_tier?: RivoVipTier | null;
  birthday?: string | null;
  referral_code?: string | null;
  referral_link?: string | null;
  [key: string]: unknown;
}

/** `GET /api/customers/:customer_id/properties` */
export interface RivoCustomerProperties {
  points_tally?: number | null;
  credits_tally?: number | null;
  /** Rivo's "available unused reward" — an already-generated discount code. */
  loy_unused_reward?: {
    id?: number | string;
    code?: string | null;
    reward_type?: RivoRewardType | null;
    formatted_value?: string | null;
  } | null;
  rewards?: RivoReward[] | null;
  [key: string]: unknown;
}

/** `GET /api/customers/:customer_id/vip_tiers` */
export interface RivoVipTier {
  id?: number | string;
  name?: string | null;
  description?: string | null;
  /** Threshold to enter the tier (points or spend, per program config). */
  threshold?: number | null;
  entry_points?: number | null;
  icon_url?: string | null;
  perks?: string[] | null;
  current?: boolean | null;
  [key: string]: unknown;
}

/** `GET /api/customers/:customer_id/points_logs` and `/credits_logs` */
export interface RivoLedgerEntry {
  id?: number | string;
  /** Signed amount — negative for spends. */
  amount?: number | null;
  formatted_amount?: string | null;
  action?: string | null;
  reason?: string | null;
  description?: string | null;
  created_at?: string | null;
  expires_at?: string | null;
  [key: string]: unknown;
}

/** `GET /api/customers/:customer_id/referrals` */
export interface RivoReferral {
  id?: number | string;
  status?: string | null;
  advocate_email?: string | null;
  friend_email?: string | null;
  reward_given?: boolean | null;
  created_at?: string | null;
  [key: string]: unknown;
}

/** `GET /api/customers/:customer_id/referral_stats` */
export interface RivoReferralStats {
  referral_link?: string | null;
  referral_code?: string | null;
  completed_count?: number | null;
  pending_count?: number | null;
  total_count?: number | null;
  total_earned?: number | null;
  [key: string]: unknown;
}

/* Redemption ---------- */

/** `POST /api/customers/:customer_id/spend_points` */
export interface RivoPointsPurchase {
  id?: number | string;
  /** The generated Shopify discount code. */
  code?: string | null;
  reward_type?: RivoRewardType | null;
  formatted_value?: string | null;
  /** Present on `free_product` rewards. */
  variant_ids?: (number | string)[] | null;
  /** Present on `points_to_credit` rewards. */
  formatted_store_credit_amount?: string | null;
  [key: string]: unknown;
}

export interface RivoSpendPointsResponse {
  success?: boolean;
  points_tally?: number | null;
  credits_tally?: number | null;
  points_purchase?: RivoPointsPurchase | null;
  /** Rivo surfaces validation failures here rather than as an HTTP error. */
  error?: string | null;
  errors?: string[] | Record<string, string[]> | null;
  message?: string | null;
  formatted_store_credit_amount?: string | null;
  [key: string]: unknown;
}

/**
 * Normalized redemption result the storefront acts on. `cartStrategy` tells the
 * client what to do next; `variantIds` are Shopify variant GIDs, already
 * converted from Rivo's numeric ids.
 */
export interface RivoRedemption {
  code: string | null;
  rewardType: RivoRewardType | null;
  formattedValue: string | null;
  formattedStoreCreditAmount: string | null;
  pointsTally: number | null;
  creditsTally: number | null;
  cartStrategy: RivoCartStrategy;
  variantIds: string[];
}

/* Route payloads ---------- */

export type RivoLoaderAction =
  | 'getCustomerStatus'
  | 'getCustomerProperties'
  | 'getVipTiers'
  | 'getPointsLogs'
  | 'getCreditsLogs'
  | 'getReferrals'
  | 'getReferralStats'
  | 'getRewards'
  | 'getLoyaltySummary';

export type RivoFormAction = 'spendPoints';

/** Aggregate payload backing the loyalty sections in one request. */
export interface RivoLoyaltySummary {
  status: RivoCustomerStatus | null;
  properties: RivoCustomerProperties | null;
  vipTiers: RivoVipTier[];
  rewards: RivoReward[];
}
