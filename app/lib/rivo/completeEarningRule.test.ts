import {afterEach, describe, expect, it, vi} from 'vitest';

import {completeEarningRule} from './completeEarningRule';

/*
 * These are the security tests for awarding points from the storefront. The
 * client sends only a rule id; everything that decides the award is resolved
 * server-side. If any of these regress, a browser request could mint points.
 */

const env = {PRIVATE_RIVO_API_KEY: 'test-key'};

interface StubOptions {
  rules: Record<string, any>[];
  completedIds?: (number | string)[];
}

/** Routes fetch by path so one stub can serve rules, customer and the write. */
const stubRivo = ({rules, completedIds = []}: StubOptions) => {
  const calls: {url: string; method: string; body: string | null}[] = [];

  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string, init?: RequestInit) => {
      calls.push({
        url,
        method: init?.method || 'GET',
        body: (init?.body as string) ?? null,
      });

      if (url.includes('/earning_rules')) {
        return Response.json({
          data: rules.map((attributes) => ({id: attributes.id, attributes})),
        });
      }
      if (url.includes('/customers/')) {
        return Response.json({
          data: {
            id: 1,
            attributes: {
              id: 1,
              email: 'a@b.com',
              points_tally: 0,
              credits_tally: '0.0',
              completed_earning_rule_ids: completedIds,
            },
          },
        });
      }
      // POST /points_events
      return Response.json({data: {id: 99, attributes: {id: 99}}});
    }),
  );

  return calls;
};

const claimable = {
  id: 628340,
  title: 'Follow on TikTok',
  status: 'active',
  trigger: 'tiktok_follow',
  points_amount: 20,
};

afterEach(() => vi.unstubAllGlobals());

describe('completeEarningRule — allowlist', () => {
  it('awards a social-follow rule', async () => {
    const calls = stubRivo({rules: [claimable]});
    const {data, error} = await completeEarningRule({
      env,
      customerId: '1',
      ruleId: 628340,
    });

    expect(error).toBeNull();
    expect(data).toEqual({
      ruleId: 628340,
      title: 'Follow on TikTok',
      pointsAwarded: 20,
    });

    const write = calls.find(({method}) => method === 'POST');
    expect(write?.url).toContain('/points_events');
  });

  it('never sends points_amount, so the award cannot be influenced', async () => {
    // Rivo derives the amount from the rule. Sending it would make the granted
    // value client-controllable.
    const calls = stubRivo({rules: [claimable]});
    await completeEarningRule({env, customerId: '1', ruleId: 628340});

    const body = calls.find(({method}) => method === 'POST')?.body ?? '';
    expect(body).toContain('source=tiktok_follow');
    expect(body).not.toContain('points_amount');
    expect(body).not.toContain('credits_amount');
  });

  it('refuses a `manual` rule — the arbitrary-amount admin path', async () => {
    const calls = stubRivo({
      rules: [
        {id: 1, title: 'Manual grant', status: 'active', trigger: 'manual'},
      ],
    });
    const {data, error} = await completeEarningRule({
      env,
      customerId: '1',
      ruleId: 1,
    });

    expect(data).toBeNull();
    expect(error).toMatch(/awarded automatically/i);
    // Critically: no write was attempted.
    expect(calls.some(({method}) => method === 'POST')).toBe(false);
  });

  it.each([
    'order_placed',
    'customer_birthday',
    'customer_member_enabled',
    'referral_complete',
  ])('refuses `%s`, which Rivo awards itself', async (trigger) => {
    const calls = stubRivo({
      rules: [{id: 1, title: 'Rivo-owned', status: 'active', trigger}],
    });
    const {data, error} = await completeEarningRule({
      env,
      customerId: '1',
      ruleId: 1,
    });

    expect(data).toBeNull();
    expect(error).toBeTruthy();
    expect(calls.some(({method}) => method === 'POST')).toBe(false);
  });

  it('resolves the trigger from Rivo, not from the caller', async () => {
    // Only the id crosses the wire. Even asking for a claimable id must use the
    // trigger Rivo reports for it.
    const calls = stubRivo({
      rules: [{...claimable, trigger: 'order_placed'}],
    });
    const {error} = await completeEarningRule({
      env,
      customerId: '1',
      ruleId: 628340,
    });

    expect(error).toBeTruthy();
    expect(calls.some(({method}) => method === 'POST')).toBe(false);
  });
});

describe('completeEarningRule — guards', () => {
  it('rejects an unknown rule id', async () => {
    const calls = stubRivo({rules: [claimable]});
    const {data, error} = await completeEarningRule({
      env,
      customerId: '1',
      ruleId: 999999,
    });

    expect(data).toBeNull();
    expect(error).toMatch(/not available/i);
    expect(calls.some(({method}) => method === 'POST')).toBe(false);
  });

  it('refuses to award the same rule twice', async () => {
    const calls = stubRivo({rules: [claimable], completedIds: [628340]});
    const {data, error} = await completeEarningRule({
      env,
      customerId: '1',
      ruleId: 628340,
    });

    expect(data).toBeNull();
    expect(error).toMatch(/already earned/i);
    expect(calls.some(({method}) => method === 'POST')).toBe(false);
  });

  it('requires a rule id', async () => {
    const {data, error} = await completeEarningRule({
      env,
      customerId: '1',
      ruleId: '',
    });
    expect(data).toBeNull();
    expect(error).toMatch(/required/i);
  });

  it('matches ids across string and number forms', async () => {
    stubRivo({rules: [claimable]});
    const {error} = await completeEarningRule({
      env,
      customerId: '1',
      ruleId: '628340',
    });
    expect(error).toBeNull();
  });
});
