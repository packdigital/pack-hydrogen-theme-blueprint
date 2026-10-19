import clsx from 'clsx';

import {Image} from '~/components/Image';
import type {RivoVipTier} from '~/lib/rivo';

/**
 * VIP tier ladder with the customer's progress toward the next tier.
 *
 * Tiers arrive sorted ascending by threshold from the server.
 */
export function RivoVipTiers({
  className,
  currentTierName,
  highestTierText = 'You’re on our highest tier',
  pointsTally,
  showHighestTier = true,
  tiers,
}: {
  className?: string;
  currentTierName?: string | null;
  highestTierText?: string;
  pointsTally?: number | null;
  /**
   * Rivo's `vip_progress_block_show_highest_tier`: whether a customer already on
   * the top tier still sees the progress block, filled, rather than nothing.
   */
  showHighestTier?: boolean;
  tiers: RivoVipTier[];
}) {
  if (!tiers?.length) return null;

  // Rivo's tier assignment is not necessarily points-driven (it can key off
  // spend or status), so trust the name it gives us and fall back to the ladder
  // only when it gives us nothing.
  const currentIndex = currentTierName
    ? tiers.findIndex(
        ({name}) => name?.toLowerCase() === currentTierName.toLowerCase(),
      )
    : typeof pointsTally === 'number'
      ? tiers.reduce(
          (acc, {threshold}, index) =>
            (threshold ?? 0) <= pointsTally ? index : acc,
          -1,
        )
      : -1;

  const derivedCurrentTier =
    currentIndex >= 0 ? tiers[currentIndex]?.name : null;

  // The next tier is the one *after* the current one in the ladder — not simply
  // the first threshold above the points tally, which would name the tier the
  // customer already holds whenever tiers aren't points-based.
  const nextTier = currentIndex >= 0 ? tiers[currentIndex + 1] : tiers[0];
  const nextThreshold = nextTier?.threshold ?? null;

  const currentThreshold =
    currentIndex >= 0 ? (tiers[currentIndex]?.threshold ?? 0) : 0;

  // Only show progress when the balance is actually consistent with the ladder.
  // A Silver customer sitting at 0 points means tiers are driven by something
  // other than points, and a bar would be misleading.
  const tiersTrackPoints =
    typeof pointsTally === 'number' && pointsTally >= currentThreshold;

  // Liquid keeps the block visible on the top tier, pinned at 100%, instead of
  // letting it vanish — otherwise the most loyal customers see the least.
  const isHighestTier = currentIndex >= 0 && currentIndex === tiers.length - 1;

  const progress =
    tiersTrackPoints && nextThreshold && nextThreshold > currentThreshold
      ? Math.min(
          100,
          Math.round(
            ((pointsTally! - currentThreshold) /
              (nextThreshold - currentThreshold)) *
              100,
          ),
        )
      : null;

  return (
    <div className={clsx('flex flex-col gap-4', className)}>
      {isHighestTier && showHighestTier && (
        <div className="flex flex-col gap-2">
          <p className="text-body-sm">{highestTierText}</p>
          <div
            aria-label={highestTierText}
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={100}
            className="h-2 w-full overflow-hidden rounded-full bg-neutralLighter"
            role="progressbar"
          >
            <div className="size-full rounded-full bg-primary" />
          </div>
        </div>
      )}

      {!isHighestTier &&
        progress !== null &&
        nextTier &&
        nextThreshold !== null && (
          <div className="flex flex-col gap-2">
            <p className="text-body-sm">
              {`${(nextThreshold - (pointsTally || 0)).toLocaleString()} points to ${
                nextTier.name || 'the next tier'
              }`}
            </p>
            <div
              aria-label={`Progress to ${nextTier.name || 'the next tier'}`}
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={progress}
              className="h-2 w-full overflow-hidden rounded-full bg-neutralLighter"
              role="progressbar"
            >
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-500"
                style={{width: `${progress}%`}}
              />
            </div>
          </div>
        )}

      <ul className="grid gap-3 sm:grid-cols-3">
        {tiers.map((tier, index) => {
          const isCurrent =
            !!derivedCurrentTier &&
            tier.name?.toLowerCase() === derivedCurrentTier.toLowerCase();

          return (
            <li
              key={tier.id ?? tier.name ?? index}
              className={clsx(
                'flex flex-col gap-1 rounded-lg border p-4',
                isCurrent
                  ? 'border-primary bg-neutralLightest'
                  : 'border-border',
              )}
            >
              {/* Rivo hosts the tier icon; the merchant uploads it once in Rivo
                  admin rather than again in the customizer. */}
              {tier.iconUrl && (
                <Image
                  data={{altText: tier.name || 'Tier', url: tier.iconUrl}}
                  aspectRatio="1/1"
                  className="size-8"
                  width="64"
                />
              )}

              <p className="text-label-sm">{tier.name}</p>

              {tier.threshold !== null && (
                <p className="text-caption text-neutralDark">
                  {`${tier.threshold.toLocaleString()}+ points`}
                </p>
              )}

              {isCurrent && (
                <p className="text-caption text-primary">Your current tier</p>
              )}

              {!!tier.perks.length && (
                <ul className="mt-1 flex flex-col gap-0.5">
                  {tier.perks.map((perk, perkIndex) => (
                    <li
                      key={perkIndex}
                      className="text-caption text-neutralDark"
                    >
                      {perk}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

RivoVipTiers.displayName = 'RivoVipTiers';
