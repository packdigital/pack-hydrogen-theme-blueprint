import {afterEach, describe, expect, it, vi} from 'vitest';

import {redeemReward} from './redeemReward';
import type {RivoReward} from './rivo.types';

const env = {PRIVATE_RIVO_API_KEY: 'test-key'};

const reward: RivoReward = {
  id: 709485,
  name: '$5 off coupon',
  description: null,
  enabled: true,
  rewardType: 'fixed_amount',
  pointsAmount: 100,
  isIncremental: false,
  rewardValue: 5,
  iconUrl: null,
  productId: null,
  variantIds: [],
  minOrderValueInCents: null,
};

/** Stub the POST /points_redemptions response, capturing the request body. */
const stubRedemption = (attributes: Record<string, any>) => {
  const calls: {body: string | null}[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (_url: string, init?: RequestInit) => {
      calls.push({body: (init?.body as string) ?? null});
      return Response.json({data: {id: attributes.id, attributes}});
    }),
  );
  return calls;
};

/** Stub an arbitrary raw body, to cover the shapes an envelope can't express. */
const stubRawBody = (body: string) =>
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(body, {status: 200})),
  );

afterEach(() => vi.unstubAllGlobals());

describe('redeemReward', () => {
  it('returns the discount code and the cart strategy', async () => {
    // Shape captured from a real redemption on pack-hydrogen-essentials.
    stubRedemption({
      id: 35813638,
      code: 'BAL-ef95d3d74ae7',
      name: '$5 off coupon',
      points_amount: 100,
      points_diff: -100,
      reward: {reward_type: 'fixed_amount'},
    });

    const {data, error} = await redeemReward({
      env,
      customerId: '1',
      rewardId: 709485,
      reward,
    });

    expect(error).toBeNull();
    expect(data).toMatchObject({
      code: 'BAL-ef95d3d74ae7',
      rewardType: 'fixed_amount',
      cartStrategy: 'discount_code',
      variantIds: [],
    });
  });

  it('reports points spent as a positive magnitude', async () => {
    // points_diff is -100; the confirmation copy wants "100 points".
    stubRedemption({
      id: 1,
      code: 'BAL-x',
      points_amount: 100,
      points_diff: -100,
      reward: {reward_type: 'fixed_amount'},
    });
    const {data} = await redeemReward({
      env,
      customerId: '1',
      rewardId: 709485,
      reward,
    });
    expect(data?.pointsSpent).toBe(100);
  });

  it('adds a cart line for a free-product reward', async () => {
    stubRedemption({
      id: 1,
      code: 'BAL-gift',
      reward: {reward_type: 'free_product', variant_ids: [456]},
    });
    const {data} = await redeemReward({
      env,
      customerId: '1',
      rewardId: 1,
      reward: {...reward, rewardType: 'free_product', variantIds: [456]},
    });

    expect(data).toMatchObject({
      cartStrategy: 'discount_code_and_line',
      variantIds: ['gid://shopify/ProductVariant/456'],
    });
  });

  it('falls back to the reward config for variants', async () => {
    // Rivo does not always echo variant_ids on the redemption.
    stubRedemption({
      id: 1,
      code: 'BAL-gift',
      reward: {reward_type: 'free_product'},
    });
    const {data} = await redeemReward({
      env,
      customerId: '1',
      rewardId: 1,
      reward: {...reward, rewardType: 'free_product', variantIds: [789]},
    });
    expect(data?.variantIds).toEqual(['gid://shopify/ProductVariant/789']);
  });

  it('degrades a free-product reward with no variant to code-only', async () => {
    stubRedemption({
      id: 1,
      code: 'BAL-gift',
      reward: {reward_type: 'free_product'},
    });
    const {data} = await redeemReward({
      env,
      customerId: '1',
      rewardId: 1,
      reward: {...reward, rewardType: 'free_product', variantIds: []},
    });
    expect(data?.cartStrategy).toBe('discount_code');
  });

  it('accepts a store-credit reward with no code, since the cart is untouched', async () => {
    stubRedemption({
      id: 1,
      code: null,
      formatted_store_credit_amount: '$10.00',
      reward: {reward_type: 'points_to_credit'},
    });
    const {data, error} = await redeemReward({
      env,
      customerId: '1',
      rewardId: 1,
      reward: {...reward, rewardType: 'points_to_credit'},
    });

    expect(error).toBeNull();
    expect(data).toMatchObject({
      cartStrategy: 'none',
      formattedStoreCreditAmount: '$10.00',
    });
  });

  it('errors when a code-based reward comes back without a code', async () => {
    // Points are already spent at this point, so the message has to say so
    // rather than implying nothing happened.
    stubRedemption({id: 1, code: null, reward: {reward_type: 'fixed_amount'}});
    const {data, error} = await redeemReward({
      env,
      customerId: '1',
      rewardId: 709485,
      reward,
    });

    expect(data).toBeNull();
    expect(error).toMatch(/no discount code/i);
    expect(error).toMatch(/before retrying/i);
  });

  it('errors on a genuinely empty response body', async () => {
    // rivoRequest leaves `data` null for a zero-length body, which is the only
    // way the empty-response branch is reached.
    stubRawBody('');
    const {data, error} = await redeemReward({
      env,
      customerId: '1',
      rewardId: 709485,
      reward,
    });
    expect(data).toBeNull();
    expect(error).toMatch(/empty response/i);
  });

  it('treats a `{}` body as a missing code, not an empty response', async () => {
    // `{}` is truthy, so `unwrapSingle(x) || x` yields `{}` and the code check
    // runs instead. That is the better message here: it warns that points were
    // already spent, so a retry would double-spend.
    stubRawBody('{}');
    const {data, error} = await redeemReward({
      env,
      customerId: '1',
      rewardId: 709485,
      reward,
    });
    expect(data).toBeNull();
    expect(error).toMatch(/no discount code/i);
    expect(error).toMatch(/not spent twice/i);
  });

  it('requires a reward id', async () => {
    const {data, error} = await redeemReward({
      env,
      customerId: '1',
      rewardId: '',
      reward,
    });
    expect(data).toBeNull();
    expect(error).toMatch(/required/i);
  });

  it('sends the incremental amounts only when given', async () => {
    const calls = stubRedemption({
      id: 1,
      code: 'BAL-x',
      reward: {reward_type: 'fixed_amount'},
    });
    await redeemReward({
      env,
      customerId: '1',
      rewardId: 709485,
      pointsAmount: 250,
      reward,
    });

    const body = calls[0]?.body ?? '';
    expect(body).toContain('reward_id=709485');
    expect(body).toContain('points_amount=250');
    expect(body).not.toContain('credits_amount');
  });

  it('prefers the reward type Rivo reports over the caller’s', async () => {
    stubRedemption({
      id: 1,
      code: 'BAL-x',
      reward_type: 'free_shipping',
      reward: {reward_type: 'free_shipping'},
    });
    const {data} = await redeemReward({
      env,
      customerId: '1',
      rewardId: 1,
      reward,
    });
    expect(data?.rewardType).toBe('free_shipping');
  });
});
