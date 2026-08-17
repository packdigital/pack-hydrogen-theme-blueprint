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

/** `GET /earning_rules` */
export interface RivoRawEarningRule {
  id?: number;
  title?: string | null;
  name?: string | null;
  description?: string | null;
  status?: string | null;
  /** e.g. `order_placed`, `customer_birthday`, `tiktok_follow`. */
  trigger?: string | null;
  points_amount?: number | null;
  credits_amount?: number | null;
  balance_amount?: number | null;
  /** `fixed` for a flat award; `multiplier` earns per currency unit. */
  points_type?: string | null;
  currency_base_amount?: number | null;
  /** Rivo's own copy, e.g. `"100 Points"`. Misleading for multipliers. */
  pretty_earnings_text?: string | null;
  /** Present on social/action rules — makes the card a link. */
  url?: string | null;
  button_text?: string | null;
  card_click_method?: string | null;
  hidden_from_ui?: boolean | null;
  multipliers?: unknown[] | null;
  multi_balance_settings_by_tiers?: Record<string, unknown> | null;
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

/**
 * `GET /points_events`
 *
 * Covers both points and credits: a credits grant is a points_event with
 * `points_amount: 0` and a non-zero `credits_amount`.
 */
export interface RivoRawPointsEvent {
  /**
   * The resource-level id is a scalar; the *attribute* of the same name is a
   * composite `[shop_id, event_id]` array. `unwrapCollection` prefers the former.
   */
  id?: number | (number | string)[];
  customer_identifier?: number | string | null;
  points_amount?: number | null;
  points_diff?: number | null;
  /** Rivo sends this as a string, e.g. `"1000.0"`. */
  credits_amount?: number | string | null;
  source?: string | null;
  /** Customer-facing title, usually mirroring `external_note`. */
  title?: string | null;
  /** Never expose: contains operator identity, e.g. `"someone@x.com: extra"`. */
  internal_note?: string | null;
  external_note?: string | null;
  applied_at?: string | null;
  approved_at?: string | null;
  expires_at?: string | null;
  per_event_expiration_at?: string | null;
  created_at?: string | null;
  /** Set when an event has been reversed; must not appear in the ledger. */
  revoked_at?: string | null;
  /** Set when Rivo hides an event from the customer. */
  hidden?: boolean | null;
  [key: string]: unknown;
}

/** `GET|POST /points_redemptions` */
export interface RivoRawPointsRedemption {
  id?: number;
  customer_identifier?: number | string | null;
  source?: string | null;
  reward_id?: number | null;
  /** Reward name at time of redemption, e.g. `"$5 off coupon"`. */
  name?: string | null;
  /** The generated Shopify discount code. */
  code?: string | null;
  /**
   * Timestamp the code was consumed — **not** a boolean `used` field, which the
   * docs list but the API does not return. Null means still redeemable.
   */
  used_at?: string | null;
  refunded_at?: string | null;
  revoked_at?: string | null;
  expires_at?: string | null;
  referred_email?: string | null;
  purchase_type?: string | null;
  applied_at?: string | null;
  points_diff?: number | null;
  points_amount?: number | null;
  credits_amount?: number | string | null;
  /** The full reward is nested here, including type and free-product variants. */
  reward?: RivoRawReward | null;
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
  /** Earning-rule ids the customer has already completed. */
  completedEarningRuleIds: (number | string)[];
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

export interface RivoEarningRule {
  id: number | string;
  title: string;
  description: string | null;
  /** Rivo's trigger key, useful for picking an icon per action. */
  trigger: string | null;
  pointsAmount: number | null;
  /** True when points accrue per currency unit rather than as a flat award. */
  isMultiplier: boolean;
  /** Currency amount a multiplier is measured against (usually 1). */
  currencyBaseAmount: number | null;
  /** Display string, corrected for multipliers rather than Rivo's "1 Points". */
  earningsText: string | null;
  url: string | null;
  buttonText: string | null;
  /** True when the signed-in customer has already completed this rule. */
  isCompleted: boolean;
}

export interface RivoLedgerEntry {
  id: number | string | null;
  /** Points delta. Signed — negative for spends. */
  amount: number | null;
  /** Store-credit delta on the same event; points and credits share a ledger. */
  creditsAmount: number | null;
  source: string | null;
  /** Customer-facing label only; internal notes are never sent to the browser. */
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
 * A reward the customer has already paid points for but has not used.
 *
 * Points are spent the moment a redemption is created, so if the cart mutation
 * fails — an empty cart, the 5-code ceiling, a dropped connection — the code is
 * still owed to them. These are surfaced so a paid-for reward is never lost.
 */
export interface RivoUnusedReward {
  id: number | string | null;
  code: string;
  name: string | null;
  pointsSpent: number | null;
  creditsSpent: number | null;
  appliedAt: string | null;
  expiresAt: string | null;
  rewardType: RivoRewardType | null;
  cartStrategy: RivoCartStrategy;
  variantIds: string[];
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
  | 'getEarningRules'
  | 'getRewards'
  | 'getVipTiers'
  | 'getPointsLogs'
  | 'getReferrals'
  | 'getReferralStats'
  | 'getUnusedRewards'
  | 'getLoyaltySummary';

export type RivoFormAction = 'redeemReward';

/** Aggregate payload backing the loyalty sections in one request. */
export interface RivoLoyaltySummary {
  customer: RivoCustomer | null;
  rewards: RivoReward[];
  vipTiers: RivoVipTier[];
  earningRules: RivoEarningRule[];
}
