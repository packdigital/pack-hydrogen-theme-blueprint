import type {
  RivoEnv,
  RivoRequestOptions,
  RivoResult,
  RivoCartStrategy,
  RivoRewardType,
  RivoPointsPurchase,
} from './rivo.types';

export const RIVO_DEFAULT_BASE_URL = 'https://loyalty-api.rivo.io';

const REQUEST_TIMEOUT_MS = 10_000;

/**
 * Strip anything that could leak the bearer token or internal request ids into
 * a response the browser sees.
 */
const sanitizeError = (message: string, apiKey?: string) => {
  let sanitized = message;
  if (apiKey) sanitized = sanitized.split(apiKey).join('[redacted]');
  sanitized = sanitized.replace(/Bearer\s+\S+/gi, 'Bearer [redacted]');
  return sanitized.trim();
};

export const getRivoConfig = (env: RivoEnv) => {
  const apiKey = env.PRIVATE_RIVO_STOREFRONT_API_KEY;
  const shop = env.PRIVATE_RIVO_SHOP_DOMAIN || env.PUBLIC_STORE_DOMAIN;
  const baseUrl = (env.RIVO_API_BASE_URL || RIVO_DEFAULT_BASE_URL).replace(
    /\/$/,
    '',
  );
  return {apiKey, shop, baseUrl};
};

/**
 * Core Rivo request. Server-side only — the storefront API key is shop-scoped
 * and must never reach the browser.
 */
export const rivoRequest = async <TData>({
  env,
  path,
  method = 'GET',
  searchParams,
  body,
  signal,
}: RivoRequestOptions): Promise<RivoResult<TData>> => {
  const {apiKey, shop, baseUrl} = getRivoConfig(env);

  if (!apiKey) {
    return {
      status: 500,
      data: null,
      error: 'Rivo: `PRIVATE_RIVO_STOREFRONT_API_KEY` is not set.',
    };
  }
  if (!shop) {
    return {
      status: 500,
      data: null,
      error:
        'Rivo: shop domain is not set. Set `PRIVATE_RIVO_SHOP_DOMAIN` or `PUBLIC_STORE_DOMAIN`.',
    };
  }

  const url = new URL(`${baseUrl}${path}`);
  url.searchParams.set('shop', shop);
  Object.entries(searchParams || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    url.searchParams.set(key, String(value));
  });

  // Rivo has no per-request timeout of its own; don't let a hung upstream hold
  // an Oxygen request open.
  const timeout = new AbortController();
  const timeoutId = setTimeout(() => timeout.abort(), REQUEST_TIMEOUT_MS);
  if (signal) signal.addEventListener('abort', () => timeout.abort());

  try {
    const response = await fetch(url.toString(), {
      method,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
        ...(body ? {'Content-Type': 'application/json'} : {}),
      },
      ...(body ? {body: JSON.stringify(body)} : {}),
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
        response.statusText;
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

/* Helpers ---------- */

/**
 * Rivo returns numeric Shopify ids; the Storefront API takes GIDs.
 */
export const toVariantGid = (id: number | string) => {
  const asString = String(id);
  return asString.startsWith('gid://')
    ? asString
    : `gid://shopify/ProductVariant/${asString}`;
};

/**
 * Shopify customer GID -> the numeric id Rivo expects as a path segment.
 */
export const toRivoCustomerId = (customerGid: string) => {
  const numeric = customerGid.split('/').pop();
  return numeric && /^\d+$/.test(numeric) ? numeric : null;
};

/**
 * Which cart mutations a redeemed reward requires. Gift cards and store credit
 * are settled by Shopify at checkout, so the cart is left alone.
 *
 * @see the reward-type table in the Rivo × Hydrogen redemption spec
 */
export const getCartStrategy = (
  rewardType?: RivoRewardType | null,
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

export const getRedemptionVariantGids = (
  pointsPurchase?: RivoPointsPurchase | null,
  fallbackVariantIds?: (number | string)[] | null,
) => {
  const ids = pointsPurchase?.variant_ids?.length
    ? pointsPurchase.variant_ids
    : fallbackVariantIds || [];
  return ids.filter(Boolean).map(toVariantGid);
};
