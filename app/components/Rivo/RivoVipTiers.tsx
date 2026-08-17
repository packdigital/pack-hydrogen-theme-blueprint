import clsx from 'clsx';

import type {RivoVipTier} from '~/lib/rivo';

const getThreshold = (tier: RivoVipTier) =>
  typeof tier.threshold === 'number'
    ? tier.threshold
    : typeof tier.entry_points === 'number'
      ? tier.entry_points
      : null;

/**
 * VIP tier ladder with the customer's progress toward the next tier.
 *
 * Rivo programs can key tiers off points or spend; the progress bar is only
 * rendered when the tiers expose a numeric threshold to compare against.
 */
export function RivoVipTiers({
  className,
  currentTierName,
  pointsTally,
  tiers,
}: {
  className?: string;
  currentTierName?: string | null;
  pointsTally?: number | null;
  tiers: RivoVipTier[];
}) {
  if (!tiers?.length) return null;

  const sorted = [...tiers].sort(
    (a, b) => (getThreshold(a) ?? 0) - (getThreshold(b) ?? 0),
  );

  const nextTier = sorted.find((tier) => {
    const threshold = getThreshold(tier);
    return (
      threshold !== null &&
      typeof pointsTally === 'number' &&
      threshold > pointsTally
    );
  });
  const nextThreshold = nextTier ? getThreshold(nextTier) : null;
  const progress =
    nextThreshold && typeof pointsTally === 'number'
      ? Math.min(100, Math.round((pointsTally / nextThreshold) * 100))
      : null;

  return (
    <div className={clsx('flex flex-col gap-4', className)}>
      {progress !== null && nextTier && (
        <div className="flex flex-col gap-2">
          <p className="text-body-sm">
            {`${(nextThreshold! - (pointsTally || 0)).toLocaleString()} points to ${
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
        {sorted.map((tier, index) => {
          const threshold = getThreshold(tier);
          const isCurrent = tier.current
            ? true
            : !!currentTierName &&
              tier.name?.toLowerCase() === currentTierName.toLowerCase();

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
              <p className="text-label-sm">{tier.name}</p>

              {threshold !== null && (
                <p className="text-caption text-neutralDark">
                  {`${threshold.toLocaleString()}+ points`}
                </p>
              )}

              {isCurrent && (
                <p className="text-caption text-primary">Your current tier</p>
              )}

              {!!tier.perks?.length && (
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
