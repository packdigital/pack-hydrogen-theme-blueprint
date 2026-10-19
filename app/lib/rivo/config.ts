import type {Admin} from '~/lib/admin-api';

import {toNumber} from './rivo-client';
import {SHOP_RIVO_CONFIG_QUERY} from './rivo-config.query';
import type {
  RivoMembershipTier,
  RivoProgramConfig,
  RivoReferralCampaign,
  RivoReferralSocialConfig,
  RivoResult,
  RivoTierTableRow,
} from './rivo.types';

/**
 * Rivo's program config, read from the shop metafield its Liquid blocks use.
 *
 * The Merchant REST API exposes the catalog (rewards, tiers, earning rules) but
 * none of the *program* config — expiry rules, the earnings delay, the VIP
 * comparison table, potential-points rates, referral campaigns or membership.
 * All of that lives in `ba_loy.config`, which is how `rivo-init.liquid` gets it.
 *
 * Everything degrades: an unconfigured feature is an empty subtree, and a store
 * with no Admin API token yields `null`. No caller may depend on this resolving.
 */

/** The shape Rivo writes into the metafield. Loosely typed — it is 60KB+ of JSON. */
interface RawRivoConfig {
  [key: string]: any;
}

const parseMetafield = (value?: string | null): RawRivoConfig | null => {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch (error) {
    // A malformed metafield must not take the page down.
    console.error('Rivo: could not parse program config metafield.');
    return null;
  }
};

const normalizePotentialPoints = (raw: RawRivoConfig) => {
  const config = raw.frontend?.potential_points?.order_placed;
  if (!config || typeof config !== 'object') return null;

  const byTier = config.multi_balance_settings_by_tiers || {};
  const multiBalanceByTier: RivoPotentialPointsByTier = {};

  for (const [tierName, rate] of Object.entries<any>(byTier)) {
    if (!rate || typeof rate !== 'object') continue;
    multiBalanceByTier[tierName] = {
      // Guard the divisor: `potential-points.liquid` divides by this.
      currencyBaseAmount: toNumber(rate.currency_base_amount, 1) || 1,
      balanceAmount: toNumber(rate.balance_amount, 0),
    };
  }

  return {
    enabled: config.enabled === true,
    isMultiplier: config.points_type === 'multiplier',
    pointsAmount: toNumber(config.points_amount, 0),
    currencyBaseAmount: toNumber(config.currency_base_amount, 1) || 1,
    multiBalanceByTier,
  };
};

type RivoPotentialPointsByTier = Record<
  string,
  {currencyBaseAmount: number; balanceAmount: number}
>;

/**
 * Rivo stores the comparison table as rows of `{perk, tiers: [{id, value}]}`.
 * Re-keying the cells by tier id lets the UI look a value up per column without
 * relying on array order matching the tier ladder.
 */
const normalizeTiersTable = (raw: RawRivoConfig): RivoTierTableRow[] => {
  const rows = raw.loyalty_landing_page_settings?.vip_tiers_table_data;
  if (!Array.isArray(rows)) return [];

  return rows
    .filter((row) => row && typeof row === 'object' && row.perk)
    .map((row) => ({
      perk: String(row.perk),
      valuesByTierId: (Array.isArray(row.tiers) ? row.tiers : []).reduce(
        (acc: Record<string, string>, tier: any) => {
          if (tier?.id === null || tier?.id === undefined) return acc;
          acc[String(tier.id)] = tier.value == null ? '' : String(tier.value);
          return acc;
        },
        {},
      ),
    }));
};

const normalizeReferralSocial = (
  raw: RawRivoConfig,
): RivoReferralSocialConfig | null => {
  const social = raw.referral_social_settings;
  if (!social || typeof social !== 'object') return null;

  // `share_order` is the merchant's preferred ordering; the per-channel booleans
  // say which are actually on. `link` has no boolean — it is always available.
  const order: string[] = Array.isArray(social.share_order)
    ? social.share_order
    : ['link', 'email', 'sms'];

  return {
    channels: order.filter(
      (channel) => channel === 'link' || social[channel] === true,
    ),
    smsMessage: social.sms_message || null,
    twitterMessage: social.twitter_message || null,
    whatsappMessage: social.whatsapp_message || null,
  };
};

const normalizeCampaigns = (raw: RawRivoConfig): RivoReferralCampaign[] =>
  (Array.isArray(raw.referral_campaigns) ? raw.referral_campaigns : [])
    .filter((campaign) => campaign?.id !== null && campaign?.id !== undefined)
    .map((campaign) => ({
      id: String(campaign.id),
      name: campaign.name || campaign.title || null,
    }));

const normalizeMembershipTiers = (raw: RawRivoConfig): RivoMembershipTier[] =>
  (Array.isArray(raw.membership_tiers) ? raw.membership_tiers : [])
    .filter((tier) => tier?.id !== null && tier?.id !== undefined)
    .map((tier) => ({
      id: String(tier.id),
      name: tier.name || tier.title || null,
      benefits: (Array.isArray(tier.benefits) ? tier.benefits : []).map(
        (benefit: any) => ({
          title: benefit?.title || benefit?.name || null,
          description: benefit?.description || benefit?.desc || null,
        }),
      ),
    }));

/** Rivo's translations map is flat `key -> string`; non-strings are dropped. */
const normalizeTranslations = (raw: RawRivoConfig): Record<string, string> => {
  const translations = raw.translations;
  if (!translations || typeof translations !== 'object') return {};
  return Object.entries<any>(translations).reduce(
    (acc: Record<string, string>, [key, value]) => {
      if (typeof value === 'string') acc[key] = value;
      return acc;
    },
    {},
  );
};

export const normalizeRivoProgramConfig = (
  raw: RawRivoConfig | null,
): RivoProgramConfig | null => {
  if (!raw) return null;

  return {
    pointsProgramEnabled: raw.points_program_enabled === true,
    referralProgramEnabled: raw.referral_program_enabled === true,
    membershipProgramEnabled: raw.membership_program_enabled === true,
    vipProgramEnabled: raw.vip_program_enabled === true,
    orderEarningsDelaySeconds:
      raw.order_earnings_delay_in_seconds === null ||
      raw.order_earnings_delay_in_seconds === undefined
        ? null
        : toNumber(raw.order_earnings_delay_in_seconds, 0),
    pointsExpiryEnabled: raw.points_expiry_enabled === true,
    creditsExpiryEnabled: raw.credits_expiry_enabled === true,
    // Either flag puts an expiry column on the ledger, matching the
    // `rivo-x-show` condition in `lp-how-it-works.liquid`.
    perEventExpiryEnabled:
      raw.points_per_points_log_expiry_enabled === true ||
      raw.credits_per_points_log_expiry_enabled === true,
    vipShowHighestTier: raw.vip_progress_block_show_highest_tier === true,
    vipTierType: raw.vip_program_tier_type || null,
    vipTierPeriod: raw.vip_program_period || null,
    tiersTable: normalizeTiersTable(raw),
    potentialPoints: normalizePotentialPoints(raw),
    referralSocial: normalizeReferralSocial(raw),
    referralCampaigns: normalizeCampaigns(raw),
    membershipTiers: normalizeMembershipTiers(raw),
    translations: normalizeTranslations(raw),
  };
};

/**
 * Read and normalize Rivo's program config.
 *
 * Cached long: it changes only when the merchant edits the program in Rivo admin.
 * Returns `{data: null}` rather than an error when the Admin client or the
 * metafield is missing, so a store without either still renders.
 */
export const getRivoProgramConfig = async ({
  admin,
}: {
  admin?: Admin;
}): Promise<RivoResult<RivoProgramConfig>> => {
  if (!admin) {
    // Not an error: the Blueprint runs without an Admin token in some setups.
    return {status: 200, data: null, error: null};
  }

  try {
    const {shop} = await admin.query<{shop: Record<string, any>}>(
      SHOP_RIVO_CONFIG_QUERY,
      {cache: admin.CacheLong()},
    );

    // Prefer the newer `rivo_settings` namespace, exactly as `rivo-init.liquid`
    // does; older stores only have the legacy `ba_*` keys.
    const raw =
      parseMetafield(shop?.rivoSettingsLoy?.value) ||
      parseMetafield(shop?.baLoyConfig?.value);

    return {status: 200, data: normalizeRivoProgramConfig(raw), error: null};
  } catch (error) {
    // Never fail the page on this — every consumer has a default.
    console.error('Rivo: program config read failed:', error);
    return {status: 200, data: null, error: null};
  }
};
