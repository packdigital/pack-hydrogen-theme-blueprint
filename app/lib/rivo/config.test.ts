import {describe, expect, it} from 'vitest';

import {getRivoProgramConfig, normalizeRivoProgramConfig} from './config';

/*
 * Fixtures are the real shapes returned by `shop.metafields.ba_loy.config` on a
 * live store, captured while verifying this integration. The demo store has most
 * features switched off, which is exactly the case that must degrade cleanly —
 * a Blueprint ships to stores at every configuration level.
 */

/** Verbatim subset of a real payload: everything off, subtrees empty. */
const unconfigured = {
  points_program_enabled: false,
  referral_program_enabled: false,
  membership_program_enabled: false,
  vip_program_enabled: false,
  vip_progress_block_show_highest_tier: false,
  vip_program_tier_type: 'points_earned',
  vip_program_period: 'lifetime',
  points_expiry_enabled: false,
  credits_expiry_enabled: false,
  points_per_points_log_expiry_enabled: false,
  credits_per_points_log_expiry_enabled: false,
  order_earnings_delay_in_seconds: null,
  frontend: {},
  loyalty_landing_page_settings: {
    enabled: false,
    template_suffix: 'rivo-loyalty-landing-page',
    vip_tiers_table_data: [],
  },
  referral_campaigns: [],
  membership_tiers: [],
  referral_social_settings: {
    sms: true,
    email: true,
    twitter: false,
    facebook: false,
    whatsapp: false,
    share_order: ['sms', 'email', 'link', 'twitter', 'facebook', 'whatsapp'],
    sms_message: '',
    twitter_message: '',
    whatsapp_message: '',
  },
  translations: {loyalty_page_banner_logged_out_title: 'Join the club'},
};

describe('normalizeRivoProgramConfig — unconfigured store', () => {
  const config = normalizeRivoProgramConfig(unconfigured)!;

  it('returns a fully-defaulted config rather than null', () => {
    expect(config).not.toBeNull();
    expect(config.tiersTable).toEqual([]);
    expect(config.referralCampaigns).toEqual([]);
    expect(config.membershipTiers).toEqual([]);
  });

  it('reports no potential-points config when `frontend` is empty', () => {
    // `frontend: {}` is the unconfigured state — not an error, and not a zeroed
    // rate that would render "earn 0 points" on every product page.
    expect(config.potentialPoints).toBeNull();
  });

  it('keeps a null earnings delay null rather than coercing it to 0', () => {
    // 0 and null differ: 0 would switch the pending column on for every store.
    expect(config.orderEarningsDelaySeconds).toBeNull();
  });

  it('drops share channels the merchant disabled but always keeps `link`', () => {
    expect(config.referralSocial?.channels).toEqual(['sms', 'email', 'link']);
  });
});

describe('normalizeRivoProgramConfig — absent input', () => {
  it('returns null so callers fall back to their defaults', () => {
    expect(normalizeRivoProgramConfig(null)).toBeNull();
  });
});

describe('normalizeRivoProgramConfig — per-event expiry', () => {
  it('enables the ledger expiry column when EITHER flag is set', () => {
    // Mirrors the `rivo-x-show` condition in `lp-how-it-works.liquid`, which ORs
    // the points and credits flags. Reading only one hides the column on a
    // credits-only store.
    expect(
      normalizeRivoProgramConfig({
        points_per_points_log_expiry_enabled: false,
        credits_per_points_log_expiry_enabled: true,
      })!.perEventExpiryEnabled,
    ).toBe(true);

    expect(
      normalizeRivoProgramConfig({
        points_per_points_log_expiry_enabled: true,
        credits_per_points_log_expiry_enabled: false,
      })!.perEventExpiryEnabled,
    ).toBe(true);

    expect(normalizeRivoProgramConfig({})!.perEventExpiryEnabled).toBe(false);
  });
});

describe('normalizeRivoProgramConfig — potential points', () => {
  const withPotentialPoints = (order_placed: Record<string, unknown>) =>
    normalizeRivoProgramConfig({
      frontend: {potential_points: {order_placed}},
    })!.potentialPoints;

  it('reads a flat award', () => {
    expect(
      withPotentialPoints({
        enabled: true,
        points_type: 'fixed',
        points_amount: 50,
      }),
    ).toMatchObject({enabled: true, isMultiplier: false, pointsAmount: 50});
  });

  it('reads a multiplier with its currency base', () => {
    expect(
      withPotentialPoints({
        enabled: true,
        points_type: 'multiplier',
        points_amount: 2,
        currency_base_amount: 1,
      }),
    ).toMatchObject({
      isMultiplier: true,
      pointsAmount: 2,
      currencyBaseAmount: 1,
    });
  });

  it('keys per-tier rates by tier name', () => {
    // `potential-points.liquid` looks the rate up by the customer's tier name
    // from their metafield, so the key must stay the name, not an id.
    const config = withPotentialPoints({
      enabled: true,
      points_type: 'multiplier',
      points_amount: 1,
      currency_base_amount: 1,
      multi_balance_settings_by_tiers: {
        Gold: {currency_base_amount: 1, balance_amount: 3},
      },
    });
    expect(config?.multiBalanceByTier.Gold).toEqual({
      currencyBaseAmount: 1,
      balanceAmount: 3,
    });
  });

  it('never yields a zero currency base, which would divide by zero', () => {
    // The Liquid template divides the price by this value.
    expect(
      withPotentialPoints({enabled: true, currency_base_amount: 0})
        ?.currencyBaseAmount,
    ).toBe(1);

    expect(
      withPotentialPoints({
        enabled: true,
        multi_balance_settings_by_tiers: {
          Gold: {currency_base_amount: 0, balance_amount: 5},
        },
      })?.multiBalanceByTier.Gold.currencyBaseAmount,
    ).toBe(1);
  });
});

describe('normalizeRivoProgramConfig — VIP comparison table', () => {
  it('re-keys each row by tier id rather than trusting array order', () => {
    // Rivo returns the cells as an array; matching them to columns positionally
    // would mis-align the moment a tier is added or reordered.
    const config = normalizeRivoProgramConfig({
      loyalty_landing_page_settings: {
        vip_tiers_table_data: [
          {
            perk: 'Points per $1',
            tiers: [
              {id: 552287, value: '1'},
              {id: 552289, value: '3'},
            ],
          },
        ],
      },
    })!;

    expect(config.tiersTable).toEqual([
      {perk: 'Points per $1', valuesByTierId: {'552287': '1', '552289': '3'}},
    ]);
  });

  it('drops rows with no perk label', () => {
    expect(
      normalizeRivoProgramConfig({
        loyalty_landing_page_settings: {
          vip_tiers_table_data: [{tiers: []}, null],
        },
      })!.tiersTable,
    ).toEqual([]);
  });
});

describe('normalizeRivoProgramConfig — translations', () => {
  it('keeps strings and drops anything else', () => {
    // Rivo nests non-string values in this map; they would break a text render.
    expect(
      normalizeRivoProgramConfig({
        translations: {a: 'yes', b: 42, c: {nested: true}, d: null},
      })!.translations,
    ).toEqual({a: 'yes'});
  });
});

describe('getRivoProgramConfig', () => {
  it('resolves to null without an Admin client, and reports no error', async () => {
    // Some Blueprint deployments run with no Admin token. That is a missing
    // capability, not a failure, and must not surface as a page error.
    expect(await getRivoProgramConfig({admin: undefined})).toEqual({
      status: 200,
      data: null,
      error: null,
    });
  });

  it('prefers the newer `rivo_settings` namespace over the legacy `ba_loy`', async () => {
    // `rivo-init.liquid` resolves them in this order; a store mid-migration has
    // both, and the legacy copy is the stale one.
    const admin = {
      CacheLong: () => ({}),
      query: async () => ({
        shop: {
          rivoSettingsLoy: {value: JSON.stringify({vip_program_enabled: true})},
          baLoyConfig: {value: JSON.stringify({vip_program_enabled: false})},
        },
      }),
    } as any;

    const {data} = await getRivoProgramConfig({admin});
    expect(data?.vipProgramEnabled).toBe(true);
  });

  it('falls back to `ba_loy` when the newer namespace is absent', async () => {
    // Verified against a live store: `rivo_settings.*` returns null there.
    const admin = {
      CacheLong: () => ({}),
      query: async () => ({
        shop: {
          rivoSettingsLoy: null,
          baLoyConfig: {value: JSON.stringify({vip_program_enabled: true})},
        },
      }),
    } as any;

    const {data} = await getRivoProgramConfig({admin});
    expect(data?.vipProgramEnabled).toBe(true);
  });

  it('survives a malformed metafield instead of taking the page down', async () => {
    const admin = {
      CacheLong: () => ({}),
      query: async () => ({shop: {baLoyConfig: {value: 'not json'}}}),
    } as any;

    expect(await getRivoProgramConfig({admin})).toMatchObject({
      data: null,
      error: null,
    });
  });

  it('swallows an Admin API failure — the config is never load-bearing', async () => {
    const admin = {
      CacheLong: () => ({}),
      query: async () => {
        throw new Error('403');
      },
    } as any;

    expect(await getRivoProgramConfig({admin})).toMatchObject({
      data: null,
      error: null,
    });
  });
});
