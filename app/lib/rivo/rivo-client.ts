import type {
  RivoCartStrategy,
  RivoEnv,
  RivoRawCollection,
  RivoRawSingle,
  RivoRequestOptions,
  RivoResult,
  RivoRewardType,
} from './rivo.types';

export const RIVO_DEFAULT_BASE_URL =
  'https://developer-api.rivo.io/merchant_api/v1';

const REQUEST_TIMEOUT_MS = 10_000;

/**
 * Strip anything that could leak the API key into a response the browser sees.
 */
const sanitizeError = (message: string, apiKey?: string) => {
  let sanitized = message;
  if (apiKey) sanitized = sanitized.split(apiKey).join('[redacted]');
  return sanitized.trim();
};

export const getRivoConfig = (env: RivoEnv) => {
  // PRIVATE_RIVO_STOREFRONT_API_KEY is the historical (misleading) name.
  const apiKey =
    env.PRIVATE_RIVO_API_KEY || env.PRIVATE_RIVO_STOREFRONT_API_KEY;
  const baseUrl = (env.RIVO_API_BASE_URL || RIVO_DEFAULT_BASE_URL).replace(
    /\/$/,
    '',
  );
  return {apiKey, baseUrl};
};

/**
 * Core Rivo Merchant API request. Server-side only — this key is admin-scoped
 * (it can adjust any customer's points and manage rewards), so it must never
 * reach the browser.
 */
export const rivoRequest = async <TData>({
  env,
  path,
  method = 'GET',
  searchParams,
  body,
  signal,
}: RivoRequestOptions): Promise<RivoResult<TData>> => {
  const {apiKey, baseUrl} = getRivoConfig(env);

  if (!apiKey) {
    return {
      status: 500,
      data: null,
      error: 'Rivo: `PRIVATE_RIVO_API_KEY` is not set.',
    };
  }

  const url = new URL(`${baseUrl}${path}`);
  Object.entries(searchParams || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (typeof value === 'object') {
      // Rivo takes nested params as `filters[customer_identifier]=123`.
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        if (
          nestedValue === undefined ||
          nestedValue === null ||
          nestedValue === ''
        )
          return;
        url.searchParams.set(`${key}[${nestedKey}]`, String(nestedValue));
      });
      return;
    }
    url.searchParams.set(key, String(value));
  });

  // Rivo has no per-request timeout of its own; don't let a hung upstream hold
  // an Oxygen request open.
  const timeout = new AbortController();
  const timeoutId = setTimeout(() => timeout.abort(), REQUEST_TIMEOUT_MS);
  if (signal) signal.addEventListener('abort', () => timeout.abort());

  let encodedBody: string | undefined;
  if (body) {
    const params = new URLSearchParams();
    Object.entries(body).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      params.set(key, String(value));
    });
    encodedBody = params.toString();
  }

  try {
    const response = await fetch(url.toString(), {
      method,
      headers: {
        Accept: 'application/json',
        // Raw key — Rivo's Merchant API rejects a `Bearer` prefix with a 401.
        Authorization: apiKey,
        ...(encodedBody
          ? {'Content-Type': 'application/x-www-form-urlencoded'}
          : {}),
      },
      ...(encodedBody ? {body: encodedBody} : {}),
      signal: timeout.signal,
    });

    const text = await response.text();
    let json: any = null;
    if (text) {
      try {
        json = JSON.parse(text);
      } catch (error) {
        return {
          status: 502,
          data: null,
          error: `Rivo: ${method} ${path} returned a non-JSON response (status ${response.status}).`,
        };
      }
    }

    if (!response.ok) {
      const detail =
        json?.error ||
        json?.message ||
        (Array.isArray(json?.errors) ? json.errors.join(', ') : null) ||
        response.statusText ||
        'Unknown error';
      return {
        status: response.status,
        data: null,
        error: sanitizeError(
          `Rivo: ${method} ${path} failed (${response.status}): ${detail}`,
          apiKey,
        ),
      };
    }

    return {status: response.status, data: json as TData, error: null};
  } catch (error) {
    const isAbort = error instanceof Error && error.name === 'AbortError';
    const message = isAbort
      ? `Rivo: ${method} ${path} timed out after ${REQUEST_TIMEOUT_MS}ms.`
      : `Rivo: ${method} ${path} errored: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`;
    console.error(sanitizeError(message, apiKey));
    return {status: 500, data: null, error: sanitizeError(message, apiKey)};
  } finally {
    clearTimeout(timeoutId);
  }
};

/* JSON:API unwrapping ---------- */

/** Pull `attributes` out of a single-resource envelope. */
export const unwrapSingle = <TAttributes>(
  payload: RivoRawSingle<TAttributes> | null,
): TAttributes | null => payload?.data?.attributes || null;

/**
 * Pull `attributes` out of every member of a collection envelope.
 *
 * The resource-level `id` wins over `attributes.id`: on some resources
 * (`points_event`) the attribute is a composite `[shop_id, event_id]` array
 * while the resource id is the plain scalar.
 */
export const unwrapCollection = <TAttributes extends {id?: unknown}>(
  payload: RivoRawCollection<TAttributes> | null,
): TAttributes[] =>
  (payload?.data || [])
    .filter((resource) => !!resource?.attributes)
    .map((resource) => ({
      ...(resource.attributes as TAttributes),
      id: resource.id ?? resource.attributes?.id,
    }));

/* Helpers ---------- */

/** Rivo sends money-ish values as strings, e.g. `credits_tally: "0.0"`. */
export const toNumber = (value: unknown, fallback = 0) => {
  if (typeof value === 'number')
    return Number.isFinite(value) ? value : fallback;
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
};

/** VIP tier fields come back as either a bare name or an object. */
export const toTierName = (
  tier: string | {name?: string | null} | null | undefined,
) => {
  if (!tier) return null;
  return typeof tier === 'string' ? tier : tier.name || null;
};

/** Rivo returns numeric Shopify ids; the Storefront API takes GIDs. */
export const toVariantGid = (id: number | string) => {
  const asString = String(id);
  return asString.startsWith('gid://')
    ? asString
    : `gid://shopify/ProductVariant/${asString}`;
};

/** Shopify customer GID -> the numeric id Rivo uses as `customer_identifier`. */
export const toRivoCustomerId = (customerGid: string) => {
  const numeric = customerGid.split('/').pop();
  return numeric && /^\d+$/.test(numeric) ? numeric : null;
};

/**
 * Which cart mutations a redeemed reward requires. Gift cards and store credit
 * are settled by Shopify at checkout, so the cart is left alone.
 */
export const getCartStrategy = (
  rewardType?: RivoRewardType | string | null,
): RivoCartStrategy => {
  switch (rewardType) {
    case 'free_product':
      return 'discount_code_and_line';
    case 'gift_card':
    case 'points_to_credit':
      return 'none';
    case 'fixed_amount':
    case 'percentage':
    case 'free_shipping':
      return 'discount_code';
    default:
      // Unknown/new reward type: a code is the safe default if one came back.
      return 'discount_code';
  }
};

/**
 * Triggers the storefront is allowed to award.
 *
 * Everything else — `order_placed`, `customer_birthday`,
 * `customer_member_enabled`, `referral_complete` — is awarded by Rivo itself from
 * its own signals and must never be awardable from a browser request.
 *
 * `manual` is deliberately excluded: it is the admin grant path and accepts an
 * arbitrary `points_amount`, so exposing it would let anyone mint points.
 */
export const STOREFRONT_AWARDABLE_TRIGGERS = new Set([
  'instagram_follow',
  'tiktok_follow',
  'facebook_like',
  'facebook_share',
  'twitter_follow',
  'twitter_share',
  'visit_url',
  'custom_action',
]);

export const isClaimableTrigger = (trigger?: string | null) =>
  !!trigger && STOREFRONT_AWARDABLE_TRIGGERS.has(trigger);
