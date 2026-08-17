/*
 * Types for Rivo's Merchant REST API.
 *
 * Base URL: https://developer-api.rivo.io/merchant_api/v1
 * Auth: `Authorization: <api key>` — raw, NOT `Bearer`. Server-side only.
 *
 * Two shapes live here:
 * - `RivoRaw*` mirrors Rivo's JSON:API payloads (snake_case, inside
 *   `data[].attributes`).
 * - Everything else is the normalized camelCase shape the storefront consumes,
 *   produced at the server boundary so the UI never depends on Rivo's field
 *   names. See `./README.md`.
 */

/* Env ---------- */

export interface RivoEnv {
  PRIVATE_RIVO_API_KEY?: string;
  /** @deprecated Misnamed — this is a Merchant API key. Use `PRIVATE_RIVO_API_KEY`. */
  PRIVATE_RIVO_STOREFRONT_API_KEY?: string;
  RIVO_API_BASE_URL?: string;
}

/* Request plumbing ---------- */

export interface RivoRequestOptions {
  env: RivoEnv;
  /** Path after the base URL, e.g. `/customers/123`. */
  path: string;
  method?: 'GET' | 'POST' | 'PUT';
  /** Query params. Nested objects become `filters[key]=value`. */
  searchParams?: Record<
    string,
    | string
    | number
    | undefined
    | null
    | Record<string, string | number | undefined | null>
  >;
  /** POST/PUT body. Sent as `application/x-www-form-urlencoded`, which is what Rivo expects. */
  body?: Record<string, string | number | boolean | undefined | null>;
  signal?: AbortSignal;
}

export interface RivoResult<TData> {
  status: number;
  data: TData | null;
  error: string | null;
}

/** Rivo wraps every resource in a JSON:API envelope. */
export interface RivoRawResource<TAttributes> {
  type?: string;
  id?: number | string;
  attributes?: TAttributes;
}

export interface RivoRawCollection<TAttributes> {
  links?: {self?: string; next?: string; last?: string};
  data?: RivoRawResource<TAttributes>[];
}

export interface RivoRawSingle<TAttributes> {
  data?: RivoRawResource<TAttributes>;
}

/* Raw payloads ---------- */

/** `GET /customers/:customer_identifier` */
export interface RivoRawCustomer {
  id?: number;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  accepts_marketing?: boolean;
  orders_count?: number;
  verified_email?: boolean;
  total_spent?: number;
  shopify_tags?: string[];
  loyalty_status?: string | null;
  points_tally?: number | null;
  /** Rivo returns credits as a *string*, e.g. `"0.0"`. */
  credits_tally?: string | number | null;
  dob?: string | null;
  referral_url?: string | null;
  referral_code?: string | null;
  vip_tier?: string | {name?: string | null} | null;
  next_vip_tier?:
    string | {name?: string | null; threshold?: number | null} | null;
  points_expire_at?: string | null;
  lifetime_earnings_tally?: number | null;
  completed_earning_rule_ids?: (number | string)[];
  [key: string]: unknown;
}

/** `GET /rewards` */
export interface RivoRawReward {
  id?: number;
  name?: string | null;
  enabled?: boolean;
  points_amount?: number | null;
  /** `fixed` for a set price; anything else is treated as incremental. */
  points_type?: string | null;
  reward_type?: string | null;
  /** `points` rewards are customer-redeemable; `referrer` ones are auto-granted. */
  source?: string | null;
  pretty_display_rewards?: string | null;
  min_order_value_in_cents?: number | null;
  min_order_quantity?: number | null;
  expiry_months?: number | null;
  reward_value?: number | null;
  redeemed_count?: number | null;
  purchase_type?: string | null;
  recurring_cycle_limit?: number | null;
  icon_url?: string | null;
  product_id?: number | null;
  variant_ids?: (number | string)[] | null;
  terms_of_service?: {
    reward_type?: string | null;
    applies_to?: string | null;
    show_tos?: boolean | null;
  } | null;
  [key: string]: unknown;
}

/** `GET /vip_tiers` */
export interface RivoRawVipTier {
  id?: number;
  name?: string | null;
  threshold?: number | null;
  icon_url?: string | null;
  perks?: string[] | null;
  [key: string]: unknown;
}

/** `GET /points_events` */
export interface RivoRawPointsEvent {
  id?: number;
  customer_identifier?: number | string | null;
  points_amount?: number | null;
  credits_amount?: number | string | null;
  source?: string | null;
  internal_note?: string | null;
  external_note?: string | null;
  applied_at?: string | null;
  expires_at?: string | null;
  created_at?: string | null;
  [key: string]: unknown;
}

/** `GET|POST /points_redemptions` */
export interface RivoRawPointsRedemption {
  id?: number;
  customer_identifier?: number | string | null;
  source?: string | null;
  reward_id?: number | null;
  /** The generated Shopify discount code. */
  code?: string | null;
  used?: boolean | null;
  referred_email?: string | null;
  purchase_type?: string | null;
  applied_at?: string | null;
  points_diff?: number | null;
  points_amount?: number | null;
  /** Present on free-product rewards. */
  variant_ids?: (number | string)[] | null;
  /** Present on store-credit rewards. */
  formatted_store_credit_amount?: string | null;
  [key: string]: unknown;
}

/** `GET /referrals` */
export interface RivoRawReferral {
  id?: number;
  status?: string | null;
  advocate_email?: string | null;
  referred_email?: string | null;
  completed_at?: string | null;
  created_at?: string | null;
  [key: string]: unknown;
}

/* Normalized shapes ---------- */

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

export interface RivoCustomer {
  id: number | string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  loyaltyStatus: string | null;
  pointsTally: number;
  /** Parsed to a number; Rivo sends this as a string. */
  creditsTally: number;
  lifetimeEarningsTally: number | null;
  vipTierName: string | null;
  nextVipTierName: string | null;
  nextVipTierThreshold: number | null;
  referralUrl: string | null;
  referralCode: string | null;
  pointsExpireAt: string | null;
}

export interface RivoReward {
  id: number | string;
  name: string;
  description: string | null;
  enabled: boolean;
  rewardType: RivoRewardType | null;
  /** Points required for a fixed reward; the minimum for an incremental one. */
  pointsAmount: number | null;
  isIncremental: boolean;
  rewardValue: number | null;
  iconUrl: string | null;
  productId: number | string | null;
  variantIds: (number | string)[];
  minOrderValueInCents: number | null;
}

export interface RivoVipTier {
  id: number | string | null;
  name: string | null;
  threshold: number | null;
  iconUrl: string | null;
  perks: string[];
}

export interface RivoLedgerEntry {
  id: number | string | null;
  /** Signed — negative for spends. */
  amount: number | null;
  source: string | null;
  /** Customer-facing note only; internal notes are never sent to the browser. */
  note: string | null;
  appliedAt: string | null;
  expiresAt: string | null;
}

export interface RivoReferral {
  id: number | string | null;
  status: string | null;
  referredEmail: string | null;
  completedAt: string | null;
  createdAt: string | null;
}

export interface RivoReferralStats {
  referralUrl: string | null;
  referralCode: string | null;
  completedCount: number;
  pendingCount: number;
  totalCount: number;
}

/**
 * Normalized redemption result the storefront acts on. `cartStrategy` tells the
 * client what to do next; `variantIds` are Shopify variant GIDs, already
 * converted from Rivo's numeric ids.
 */
export interface RivoRedemption {
  id: number | string | null;
  code: string | null;
  rewardType: RivoRewardType | null;
  rewardName: string | null;
  pointsSpent: number | null;
  formattedStoreCreditAmount: string | null;
  cartStrategy: RivoCartStrategy;
  variantIds: string[];
}

/* Route payloads ---------- */

export type RivoLoaderAction =
  | 'getCustomer'
  | 'getRewards'
  | 'getVipTiers'
  | 'getPointsLogs'
  | 'getReferrals'
  | 'getReferralStats'
  | 'getLoyaltySummary';

export type RivoFormAction = 'redeemReward';

/** Aggregate payload backing the loyalty sections in one request. */
export interface RivoLoyaltySummary {
  customer: RivoCustomer | null;
  rewards: RivoReward[];
  vipTiers: RivoVipTier[];
}
