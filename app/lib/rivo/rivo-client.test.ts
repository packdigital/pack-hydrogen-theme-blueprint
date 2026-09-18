import {describe, expect, it} from 'vitest';

import {
  getCartStrategy,
  getRivoConfig,
  isClaimableTrigger,
  toNumber,
  toRivoCustomerId,
  toTierName,
  toVariantGid,
  unwrapCollection,
  unwrapSingle,
  RIVO_DEFAULT_BASE_URL,
} from './rivo-client';

describe('toNumber', () => {
  // Rivo sends money-ish values as strings; reading them raw broke the credits
  // tile and the store-credit ledger row.
  it('parses the numeric strings Rivo actually sends', () => {
    expect(toNumber('0.0')).toBe(0);
    expect(toNumber('1000.0')).toBe(1000);
    expect(toNumber('12.34')).toBe(12.34);
  });

  it('passes numbers through', () => {
    expect(toNumber(0)).toBe(0);
    expect(toNumber(-100)).toBe(-100);
  });

  it('falls back rather than yielding NaN', () => {
    expect(toNumber(null)).toBe(0);
    expect(toNumber(undefined)).toBe(0);
    expect(toNumber('')).toBe(0);
    expect(toNumber('not a number')).toBe(0);
    expect(toNumber(Number.NaN)).toBe(0);
    expect(toNumber(Number.POSITIVE_INFINITY)).toBe(0);
    expect(toNumber(undefined, 5)).toBe(5);
  });

  it('does not confuse a real 0 with a missing value', () => {
    // `toNumber('0.0')` and `toNumber(null)` both return 0, so callers must
    // null-check before calling — this documents that expectation.
    expect(toNumber('0.0')).toBe(toNumber(null));
  });
});

describe('toTierName', () => {
  it('accepts both shapes Rivo returns', () => {
    expect(toTierName('Silver')).toBe('Silver');
    expect(toTierName({name: 'Gold'})).toBe('Gold');
  });

  it('handles absent tiers', () => {
    expect(toTierName(null)).toBeNull();
    expect(toTierName(undefined)).toBeNull();
    expect(toTierName({})).toBeNull();
    expect(toTierName({name: null})).toBeNull();
  });
});

describe('toVariantGid', () => {
  it('converts Rivo numeric ids to Storefront GIDs', () => {
    expect(toVariantGid(123)).toBe('gid://shopify/ProductVariant/123');
    expect(toVariantGid('456')).toBe('gid://shopify/ProductVariant/456');
  });

  it('leaves an existing GID alone', () => {
    const gid = 'gid://shopify/ProductVariant/789';
    expect(toVariantGid(gid)).toBe(gid);
  });
});

describe('toRivoCustomerId', () => {
  it('extracts the numeric id from a Shopify GID', () => {
    expect(toRivoCustomerId('gid://shopify/Customer/7198630248648')).toBe(
      '7198630248648',
    );
  });

  it('rejects anything that is not a numeric id', () => {
    // A non-numeric tail must not be forwarded to Rivo as a customer id.
    expect(toRivoCustomerId('gid://shopify/Customer/abc')).toBeNull();
    expect(toRivoCustomerId('')).toBeNull();
    expect(toRivoCustomerId('gid://shopify/Customer/')).toBeNull();
  });
});

describe('getCartStrategy', () => {
  it('applies a discount code for code-only rewards', () => {
    expect(getCartStrategy('fixed_amount')).toBe('discount_code');
    expect(getCartStrategy('percentage')).toBe('discount_code');
    expect(getCartStrategy('free_shipping')).toBe('discount_code');
  });

  it('also adds a cart line for free products', () => {
    expect(getCartStrategy('free_product')).toBe('discount_code_and_line');
  });

  it('leaves the cart alone for rewards Shopify settles at checkout', () => {
    expect(getCartStrategy('gift_card')).toBe('none');
    expect(getCartStrategy('points_to_credit')).toBe('none');
  });

  it('defaults to applying a code for unknown types', () => {
    // A new Rivo reward type should still apply whatever code came back rather
    // than silently dropping it.
    expect(getCartStrategy('something_new')).toBe('discount_code');
    expect(getCartStrategy(null)).toBe('discount_code');
    expect(getCartStrategy(undefined)).toBe('discount_code');
  });
});

describe('isClaimableTrigger', () => {
  it('allows the actions a storefront can legitimately report', () => {
    for (const trigger of [
      'instagram_follow',
      'tiktok_follow',
      'facebook_like',
      'facebook_share',
      'twitter_follow',
      'twitter_share',
      'visit_url',
      'custom_action',
    ]) {
      expect(isClaimableTrigger(trigger), trigger).toBe(true);
    }
  });

  it('refuses `manual`, which would let anyone mint points', () => {
    // `manual` is the admin grant path and takes an arbitrary points_amount.
    // This is the single most important assertion in this file.
    expect(isClaimableTrigger('manual')).toBe(false);
  });

  it('refuses triggers Rivo awards from its own signals', () => {
    for (const trigger of [
      'order_placed',
      'customer_birthday',
      'customer_member_enabled',
      'referral_complete',
    ]) {
      expect(isClaimableTrigger(trigger), trigger).toBe(false);
    }
  });

  it('refuses empty input', () => {
    expect(isClaimableTrigger(null)).toBe(false);
    expect(isClaimableTrigger(undefined)).toBe(false);
    expect(isClaimableTrigger('')).toBe(false);
  });
});

describe('unwrapSingle', () => {
  it('pulls attributes out of the JSON:API envelope', () => {
    expect(unwrapSingle({data: {attributes: {id: 1, name: 'x'}}})).toEqual({
      id: 1,
      name: 'x',
    });
  });

  it('returns null for an empty envelope', () => {
    expect(unwrapSingle(null)).toBeNull();
    expect(unwrapSingle({})).toBeNull();
    expect(unwrapSingle({data: {}})).toBeNull();
  });
});

describe('unwrapCollection', () => {
  it('prefers the resource id over a composite attribute id', () => {
    // points_event.attributes.id is `[shop_id, event_id]`; the resource-level id
    // is the scalar. Reading the attribute put arrays into React keys.
    const unwrapped = unwrapCollection({
      data: [
        {
          id: 790964846,
          attributes: {id: [62955192520, 790964846], points_amount: 500},
        },
      ],
    });
    expect(unwrapped).toEqual([{id: 790964846, points_amount: 500}]);
  });

  it('falls back to the attribute id when the resource has none', () => {
    expect(unwrapCollection({data: [{attributes: {id: 7}}]})).toEqual([
      {id: 7},
    ]);
  });

  it('drops members with no attributes', () => {
    const unwrapped = unwrapCollection({
      data: [{id: 1, attributes: {id: 1}}, {id: 2}],
    });
    expect(unwrapped).toEqual([{id: 1}]);
  });

  it('returns an empty array for an empty envelope', () => {
    expect(unwrapCollection(null)).toEqual([]);
    expect(unwrapCollection({})).toEqual([]);
    expect(unwrapCollection({data: []})).toEqual([]);
  });
});

describe('getRivoConfig', () => {
  it('reads the current key name', () => {
    expect(getRivoConfig({PRIVATE_RIVO_API_KEY: 'abc'})).toMatchObject({
      apiKey: 'abc',
      baseUrl: RIVO_DEFAULT_BASE_URL,
    });
  });

  it('still accepts the legacy misnamed key', () => {
    expect(
      getRivoConfig({PRIVATE_RIVO_STOREFRONT_API_KEY: 'legacy'}).apiKey,
    ).toBe('legacy');
  });

  it('prefers the current name when both are set', () => {
    expect(
      getRivoConfig({
        PRIVATE_RIVO_API_KEY: 'current',
        PRIVATE_RIVO_STOREFRONT_API_KEY: 'legacy',
      }).apiKey,
    ).toBe('current');
  });

  it('strips a trailing slash so paths do not double up', () => {
    expect(
      getRivoConfig({
        PRIVATE_RIVO_API_KEY: 'k',
        RIVO_API_BASE_URL: 'https://example.com/v1/',
      }).baseUrl,
    ).toBe('https://example.com/v1');
  });
});
