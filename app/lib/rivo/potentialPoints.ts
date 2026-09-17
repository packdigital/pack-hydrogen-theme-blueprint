import type {RivoPotentialPointsConfig} from './rivo.types';

/**
 * Points a customer would earn by ordering a product, mirroring the arithmetic in
 * Rivo's `potential-points.liquid`.
 *
 * The rate is per-tier when the merchant configured `multi_balance_settings_by_tiers`
 * and the customer is in one of those tiers; otherwise it is the program default.
 * Guests always get the default rate, which is the point of the block — it shows
 * what joining is worth.
 *
 * Liquid does the division with integer operands, which truncates:
 *
 *   product.price | divided_by: 100.0 | round | divided_by: base | round | times: amount
 *
 * so `$29.99` at "1 point per $10" earns 2, not 3. `Math.floor` reproduces that.
 * Diverging here would print a number the customer never actually receives.
 */
export const calculatePotentialPoints = ({
  config,
  priceAmount,
  vipTierName,
}: {
  config?: RivoPotentialPointsConfig | null;
  /** Price in the storefront's currency units, e.g. `29.99`. */
  priceAmount?: number | string | null;
  /** The customer's Rivo VIP tier name, when signed in and tiered. */
  vipTierName?: string | null;
}): number | null => {
  if (!config?.enabled) return null;

  const price =
    typeof priceAmount === 'string' ? Number(priceAmount) : priceAmount;

  if (typeof price !== 'number' || !Number.isFinite(price) || price < 0) {
    return null;
  }

  // Rivo keys the per-tier rates by tier *name*; match case-insensitively so a
  // "gold" tally against a "Gold" rate still resolves.
  const tierRate = vipTierName
    ? Object.entries(config.multiBalanceByTier).find(
        ([name]) => name.toLowerCase() === vipTierName.toLowerCase(),
      )?.[1]
    : undefined;

  const amount = tierRate ? tierRate.balanceAmount : config.pointsAmount;

  if (!config.isMultiplier) {
    // Flat award: every qualifying order earns the same, whatever it cost.
    return amount > 0 ? amount : null;
  }

  const base = tierRate
    ? tierRate.currencyBaseAmount
    : config.currencyBaseAmount;

  if (!base) return null;

  const points = Math.floor(Math.round(price) / base) * amount;
  return points > 0 ? points : null;
};
