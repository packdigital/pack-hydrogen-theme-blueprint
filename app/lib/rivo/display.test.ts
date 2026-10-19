import {afterEach, describe, expect, it, vi} from 'vitest';

import {
  getCustomer,
  getEarningRules,
  getPointsLogs,
  getRewards,
  getUnusedRewards,
  getVipTiers,
  toStorefrontReferralUrl,
} from './display';

/*
 * These exercise the normalizers through the public endpoint functions, using
 * payloads captured verbatim from pack-hydrogen-essentials. Every assertion
 * marked "regression" corresponds to a bug that shipped and was caught by hand.
 */

const env = {PRIVATE_RIVO_API_KEY: 'test-key'};

/** Stub fetch with a JSON:API collection envelope. */
const stubCollection = (attributesList: Record<string, any>[]) =>
  vi.stubGlobal(
    'fetch',
    vi.fn(async () =>
      Response.json({
        data: attributesList.map((attributes) => ({
          id: attributes.id,
          attributes,
        })),
      }),
    ),
  );

/** Stub fetch with a JSON:API single-resource envelope. */
const stubSingle = (attributes: Record<string, any>) =>
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => Response.json({data: {id: attributes.id, attributes}})),
  );

afterEach(() => vi.unstubAllGlobals());

describe('getCustomer', () => {
  // Captured from GET /customers/7198630248648.
  const raw = {
    id: 7198630248648,
    email: 'andrew@packdigital.com',
    first_name: 'A',
    last_name: 'P',
    loyalty_status: 'member',
    points_tally: 0,
    credits_tally: '1000.0',
    dob: null,
    referral_url: 'https://shop.myshopify.com?referral_code=Q3Y7vKAPhKQArL9WZ',
    referral_code: 'Q3Y7vKAPhKQArL9WZ',
    vip_tier: {id: 552288, name: 'Silver', threshold: 500, perks: []},
    next_vip_tier: null,
    lifetime_earnings_tally: null,
    completed_earning_rule_ids: [628340],
  };

  it('parses credits_tally, which arrives as a string', async () => {
    // regression: a real $1,000 balance rendered as "0".
    stubSingle(raw);
    const {data} = await getCustomer({env, customerId: '1'});
    expect(data?.creditsTally).toBe(1000);
    expect(typeof data?.creditsTally).toBe('number');
  });

  it('reads the tier name out of the nested object', async () => {
    stubSingle(raw);
    const {data} = await getCustomer({env, customerId: '1'});
    expect(data?.vipTierName).toBe('Silver');
  });

  it('keeps lifetimeEarningsTally null rather than coercing to 0', async () => {
    // 0 lifetime points and "not reported" are different things.
    stubSingle(raw);
    const {data} = await getCustomer({env, customerId: '1'});
    expect(data?.lifetimeEarningsTally).toBeNull();
  });

  it('exposes completed earning rules for marking claimed cards', async () => {
    stubSingle(raw);
    const {data} = await getCustomer({env, customerId: '1'});
    expect(data?.completedEarningRuleIds).toEqual([628340]);
  });
});

describe('getPointsLogs', () => {
  it('uses points_diff so a spend is negative', async () => {
    // regression: reading points_amount rendered every spend as a gain. This
    // payload is the real redemption event — magnitude 100, delta -100.
    stubCollection([
      {
        id: 35813638,
        points_amount: 100,
        points_diff: -100,
        credits_amount: '0.0',
        title: 'Redeemed a Reward',
        source: 'points_purchase',
        applied_at: '2026-08-17T21:51:37.000Z',
      },
    ]);
    const {data} = await getPointsLogs({env, customerId: '1'});
    expect(data?.[0]?.amount).toBe(-100);
  });

  it('surfaces a credits-only event that has zero points', async () => {
    // regression: a $1,000 credit grant rendered as a meaningless "0" row.
    stubCollection([
      {
        id: 790964846,
        points_amount: 0,
        points_diff: 0,
        credits_amount: '1000.0',
        title: 'manual points adjustment',
        source: 'manual',
      },
    ]);
    const {data} = await getPointsLogs({env, customerId: '1'});
    expect(data).toHaveLength(1);
    expect(data?.[0]).toMatchObject({amount: 0, creditsAmount: 1000});
  });

  it('drops revoked and hidden events', async () => {
    // regression: Rivo reverses events with revoked_at instead of deleting
    // them, so a reversed grant was still shown to the customer.
    stubCollection([
      {id: 1, points_amount: 50, points_diff: 50},
      {id: 2, points_amount: 50, points_diff: 50, revoked_at: '2026-08-17'},
      {id: 3, points_amount: 50, points_diff: 50, hidden: true},
    ]);
    const {data} = await getPointsLogs({env, customerId: '1'});
    expect(data?.map(({id}) => id)).toEqual([1]);
  });

  it('drops events with no points and no credits movement', async () => {
    stubCollection([
      {id: 1, points_amount: 0, points_diff: 0, credits_amount: '0.0'},
    ]);
    const {data} = await getPointsLogs({env, customerId: '1'});
    expect(data).toEqual([]);
  });

  it('never exposes internal_note', async () => {
    // internal_note carries operator identity, e.g. "someone@x.com: extra".
    stubCollection([
      {
        id: 1,
        points_amount: 500,
        points_diff: 500,
        internal_note: 'operator@example.com: extra',
        external_note: 'manual points adjustment',
      },
    ]);
    const {data} = await getPointsLogs({env, customerId: '1'});
    expect(JSON.stringify(data)).not.toContain('operator@example.com');
    expect(data?.[0]?.note).toBe('manual points adjustment');
  });

  it('prefers the scalar resource id over the composite attribute id', async () => {
    // regression: attributes.id is [shop_id, event_id], which ended up as a
    // React key.
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json({
          data: [
            {
              id: 790964846,
              attributes: {
                id: [62955192520, 790964846],
                points_amount: 500,
                points_diff: 500,
              },
            },
          ],
        }),
      ),
    );
    const {data} = await getPointsLogs({env, customerId: '1'});
    expect(data?.[0]?.id).toBe(790964846);
  });
});

describe('getRewards', () => {
  it('filters out referrer-sourced and disabled rewards', async () => {
    // Only `source: points` rewards are customer-redeemable; Rivo grants
    // referrer ones automatically. This is why 5 rewards render as 3.
    stubCollection([
      {
        id: 1,
        name: '$5 off',
        enabled: true,
        source: 'points',
        points_amount: 100,
      },
      {id: 2, name: 'referral gift', enabled: true, source: 'referrer'},
      {id: 3, name: 'disabled', enabled: false, source: 'points'},
    ]);
    const {data} = await getRewards({env, customerId: '1'});
    expect(data?.map(({id}) => id)).toEqual([1]);
  });

  it('marks a fixed-price reward as non-incremental', async () => {
    stubCollection([
      {
        id: 1,
        name: '$5 off coupon',
        enabled: true,
        source: 'points',
        points_amount: 100,
        points_type: 'fixed',
        reward_type: 'fixed_amount',
        reward_value: 5.0,
      },
    ]);
    const {data} = await getRewards({env, customerId: '1'});
    expect(data?.[0]).toMatchObject({
      name: '$5 off coupon',
      pointsAmount: 100,
      isIncremental: false,
      rewardType: 'fixed_amount',
      rewardValue: 5,
    });
  });

  it('treats a non-fixed points_type as incremental', async () => {
    stubCollection([
      {
        id: 1,
        name: 'Custom',
        enabled: true,
        source: 'points',
        points_type: 'incremental',
      },
    ]);
    const {data} = await getRewards({env, customerId: '1'});
    expect(data?.[0]?.isIncremental).toBe(true);
  });
});

describe('getVipTiers', () => {
  it('sorts ascending by threshold', async () => {
    stubCollection([
      {id: 3, name: 'Gold', threshold: 1250},
      {id: 1, name: 'Bronze', threshold: 0},
      {id: 2, name: 'Silver', threshold: 500},
    ]);
    const {data} = await getVipTiers({env, customerId: '1'});
    expect(data?.map(({name}) => name)).toEqual(['Bronze', 'Silver', 'Gold']);
  });

  it('defaults perks to an array when Rivo omits them', async () => {
    stubCollection([{id: 1, name: 'Bronze', threshold: 0}]);
    const {data} = await getVipTiers({env, customerId: '1'});
    expect(data?.[0]?.perks).toEqual([]);
  });
});

describe('getEarningRules', () => {
  it('drops the partially-null rows Rivo returns for unconfigured rules', async () => {
    // Live store returns 5 rules, one with every field null — hence 4 rendered.
    stubCollection([
      {id: 1, title: 'Sign up', status: 'active', points_amount: 100},
      {id: 2, title: null},
      {id: 3, title: 'Hidden', hidden_from_ui: true},
      {id: 4, title: 'Off', status: 'disabled'},
    ]);
    const {data} = await getEarningRules({env, customerId: '1'});
    expect(data?.map(({id}) => id)).toEqual([1]);
  });

  it('spells out a multiplier rate instead of Rivo’s "1 Points"', async () => {
    stubCollection([
      {
        id: 2,
        title: 'Place an order',
        status: 'active',
        points_amount: 1,
        points_type: 'multiplier',
        currency_base_amount: 1,
        pretty_earnings_text: '1 Points',
      },
    ]);
    const {data} = await getEarningRules({env, customerId: '1'});
    expect(data?.[0]?.earningsText).toBe('1 point per $1');
  });

  it('marks completed rules from the ids passed in', async () => {
    stubCollection([
      {
        id: 628340,
        title: 'Follow on TikTok',
        status: 'active',
        trigger: 'tiktok_follow',
      },
      {
        id: 628336,
        title: 'Sign up',
        status: 'active',
        trigger: 'customer_member_enabled',
      },
    ]);
    const {data} = await getEarningRules({
      env,
      customerId: '1',
      completedIds: [628340],
    });
    expect(data?.find(({id}) => id === 628340)?.isCompleted).toBe(true);
    expect(data?.find(({id}) => id === 628336)?.isCompleted).toBe(false);
  });

  it('only flags storefront-awardable triggers as claimable', async () => {
    stubCollection([
      {id: 1, title: 'Follow', status: 'active', trigger: 'tiktok_follow'},
      {id: 2, title: 'Order', status: 'active', trigger: 'order_placed'},
    ]);
    const {data} = await getEarningRules({env, customerId: '1'});
    expect(data?.find(({id}) => id === 1)?.isClaimable).toBe(true);
    expect(data?.find(({id}) => id === 2)?.isClaimable).toBe(false);
  });
});

describe('getUnusedRewards', () => {
  const base = {
    points_amount: 100,
    credits_amount: '0.0',
    applied_at: '2026-08-17T21:51:37.000Z',
    name: '$5 off coupon',
    reward: {reward_type: 'fixed_amount', name: '$5 off coupon'},
  };

  it('keeps codes that have not been consumed', async () => {
    stubCollection([{...base, id: 1, code: 'BAL-aaa', used_at: null}]);
    const {data} = await getUnusedRewards({env, customerId: '1'});
    expect(data).toHaveLength(1);
    expect(data?.[0]).toMatchObject({
      code: 'BAL-aaa',
      name: '$5 off coupon',
      pointsSpent: 100,
      cartStrategy: 'discount_code',
    });
  });

  it('filters on used_at, not the boolean `used` the docs describe', async () => {
    // regression: `used` is never returned, so a check against it matched
    // everything and consumed codes were offered again.
    stubCollection([
      {...base, id: 1, code: 'BAL-used', used_at: '2026-08-17T22:00:00.000Z'},
      {...base, id: 2, code: 'BAL-refunded', refunded_at: '2026-08-17'},
      {...base, id: 3, code: 'BAL-revoked', revoked_at: '2026-08-17'},
      {...base, id: 4, code: 'BAL-open', used_at: null},
    ]);
    const {data} = await getUnusedRewards({env, customerId: '1'});
    expect(data?.map(({code}) => code)).toEqual(['BAL-open']);
  });

  it('drops expired codes but keeps ones expiring later', async () => {
    stubCollection([
      {...base, id: 1, code: 'BAL-expired', expires_at: '2020-01-01'},
      {...base, id: 2, code: 'BAL-valid', expires_at: '2999-01-01'},
    ]);
    const {data} = await getUnusedRewards({env, customerId: '1'});
    expect(data?.map(({code}) => code)).toEqual(['BAL-valid']);
  });

  it('drops records with no code at all', async () => {
    stubCollection([{...base, id: 1, code: null}]);
    const {data} = await getUnusedRewards({env, customerId: '1'});
    expect(data).toEqual([]);
  });

  it('carries free-product variants through as GIDs', async () => {
    stubCollection([
      {
        ...base,
        id: 1,
        code: 'BAL-gift',
        used_at: null,
        reward: {reward_type: 'free_product', variant_ids: [456]},
      },
    ]);
    const {data} = await getUnusedRewards({env, customerId: '1'});
    expect(data?.[0]).toMatchObject({
      cartStrategy: 'discount_code_and_line',
      variantIds: ['gid://shopify/ProductVariant/456'],
    });
  });

  it('degrades a free-product reward with no variant to code-only', async () => {
    // Otherwise the caller would await an empty cartLinesAdd.
    stubCollection([
      {
        ...base,
        id: 1,
        code: 'BAL-gift',
        used_at: null,
        reward: {reward_type: 'free_product', variant_ids: null},
      },
    ]);
    const {data} = await getUnusedRewards({env, customerId: '1'});
    expect(data?.[0]?.cartStrategy).toBe('discount_code');
  });

  it('returns newest first', async () => {
    stubCollection([
      {...base, id: 1, code: 'BAL-old', applied_at: '2026-08-01T00:00:00.000Z'},
      {...base, id: 2, code: 'BAL-new', applied_at: '2026-08-17T00:00:00.000Z'},
    ]);
    const {data} = await getUnusedRewards({env, customerId: '1'});
    expect(data?.map(({code}) => code)).toEqual(['BAL-new', 'BAL-old']);
  });
});

describe('toStorefrontReferralUrl', () => {
  const primary = 'https://hydrogen.packdigital.com';

  it('rewrites the myshopify origin to the storefront', () => {
    // Rivo builds referral links against the myshopify domain, which serves the
    // Liquid store on a headless setup — the capture hook never runs there.
    expect(
      toStorefrontReferralUrl(
        'https://shop.myshopify.com?referral_code=ABC123',
        primary,
      ),
    ).toBe('https://hydrogen.packdigital.com/?referral_code=ABC123');
  });

  it('preserves path and every query param', () => {
    expect(
      toStorefrontReferralUrl(
        'https://shop.myshopify.com/pages/x?referral_code=ABC&utm_source=y',
        primary,
      ),
    ).toBe(
      'https://hydrogen.packdigital.com/pages/x?referral_code=ABC&utm_source=y',
    );
  });

  it('no-ops when there is nothing to rewrite with', () => {
    const url = 'https://shop.myshopify.com?referral_code=ABC';
    expect(toStorefrontReferralUrl(url, undefined)).toBe(url);
    expect(toStorefrontReferralUrl(null, primary)).toBeNull();
  });

  it('returns the input unchanged rather than throwing on bad values', () => {
    expect(toStorefrontReferralUrl('not-a-url', primary)).toBe('not-a-url');
    expect(toStorefrontReferralUrl('https://shop.com?x=1', 'not-a-url')).toBe(
      'https://shop.com?x=1',
    );
  });
});
