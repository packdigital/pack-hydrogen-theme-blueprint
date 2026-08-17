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

/** Per-attempt timeout. Retries can add at most `RETRY_DEADLINE_MS` on top. */
const REQUEST_TIMEOUT_MS = 8_000;

/**
 * Stop retrying once this much time has elapsed, so a rate-limited upstream
 * can't hold an Oxygen request open for the sum of every attempt.
 */
const RETRY_DEADLINE_MS = 12_000;

const MAX_ATTEMPTS = 3;

/** Rivo's documented limit is 15 req/s per store, so waits should be short. */
const MAX_RETRY_WAIT_MS = 2_000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * `Retry-After` is either seconds or an HTTP date. Falls back to a small
 * exponential backoff, and is always capped — a long server-suggested wait is
 * worse than failing fast inside a page render.
 */
const getRetryWaitMs = (response: Response, attempt: number) => {
  const header = response.headers.get('retry-after');
  let waitMs = 0;

  if (header) {
    const seconds = Number(header);
    if (Number.isFinite(seconds)) {
      waitMs = seconds * 1000;
    } else {
      const date = new Date(header).getTime();
      if (!Number.isNaN(date)) waitMs = date - Date.now();
    }
  }

  if (waitMs <= 0) waitMs = 250 * 2 ** (attempt - 1);
  return Math.min(waitMs, MAX_RETRY_WAIT_MS);
};

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

  let encodedBody: string | undefined;
  if (body) {
    const params = new URLSearchParams();
    Object.entries(body).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      params.set(key, String(value));
    });
    encodedBody = params.toString();
  }

  /**
   * Whether a *failed* attempt of this request is safe to repeat.
   *
   * GETs are idempotent. A POST is not: `/points_redemptions` spends points and
   * `/points_events` awards them, so a timeout or 5xx could mean the write
   * landed and only the response was lost — repeating it would double-spend.
   * A 429 is handled separately, since it means the request was rejected before
   * any work happened.
   */
  const isIdempotent = method === 'GET';
  const startedAt = Date.now();

  const attemptRequest = async (): Promise<{
    result: RivoResult<TData>;
    /** Set when the upstream asked us to back off. */
    retryAfterMs?: number;
    /** Set when the attempt failed in a way that may succeed on repeat. */
    transient?: boolean;
  }> => {
    // Rivo has no per-request timeout of its own; don't let a hung upstream hold
    // an Oxygen request open.
    const timeout = new AbortController();
    const timeoutId = setTimeout(() => timeout.abort(), REQUEST_TIMEOUT_MS);
    const abortFromCaller = () => timeout.abort();
    if (signal) signal.addEventListener('abort', abortFromCaller);

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
            result: {
              status: 502,
              data: null,
              error: `Rivo: ${method} ${path} returned a non-JSON response (status ${response.status}).`,
            },
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
        const result = {
          status: response.status,
          data: null,
          error: sanitizeError(
            `Rivo: ${method} ${path} failed (${response.status}): ${detail}`,
            apiKey,
          ),
        };

        if (response.status === 429) {
          return {result, retryAfterMs: getRetryWaitMs(response, 1)};
        }
        // 5xx may be a blip; 4xx won't change on repeat.
        return {result, transient: response.status >= 500};
      }

      return {
        result: {status: response.status, data: json as TData, error: null},
      };
    } catch (error) {
      const isAbort = error instanceof Error && error.name === 'AbortError';
      const message = isAbort
        ? `Rivo: ${method} ${path} timed out after ${REQUEST_TIMEOUT_MS}ms.`
        : `Rivo: ${method} ${path} errored: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`;
      return {
        result: {
          status: isAbort ? 504 : 500,
          data: null,
          error: sanitizeError(message, apiKey),
        },
        transient: true,
      };
    } finally {
      clearTimeout(timeoutId);
      if (signal) signal.removeEventListener('abort', abortFromCaller);
    }
  };

  let last: Awaited<ReturnType<typeof attemptRequest>> | null = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    last = await attemptRequest();

    if (!last.result.error) return last.result;

    const rateLimited = last.retryAfterMs !== undefined;
    // Rate limiting is safe to retry on any method; other failures only on GET.
    const shouldRetry = rateLimited || (last.transient && isIdempotent);
    const outOfAttempts = attempt >= MAX_ATTEMPTS;
    const outOfTime = Date.now() - startedAt >= RETRY_DEADLINE_MS;

    if (!shouldRetry || outOfAttempts || outOfTime) break;

    const waitMs = last.retryAfterMs ?? 250 * 2 ** (attempt - 1);
    if (rateLimited) {
      console.warn(
        `Rivo: ${method} ${path} rate limited, retrying in ${waitMs}ms (attempt ${attempt + 1}/${MAX_ATTEMPTS}).`,
      );
    }
    await sleep(Math.min(waitMs, MAX_RETRY_WAIT_MS));
  }

  const result = last!.result;
  console.error(result.error);
  return result;
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
