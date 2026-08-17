import clsx from 'clsx';

import type {RivoVipTier} from '~/lib/rivo';

/**
 * VIP tier ladder with the customer's progress toward the next tier.
 *
 * Tiers arrive sorted ascending by threshold from the server.
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

  const nextTier =
    typeof pointsTally === 'number'
      ? tiers.find(
          ({threshold}) => threshold !== null && threshold > pointsTally,
        )
      : undefined;
  const nextThreshold = nextTier?.threshold ?? null;
  const progress =
    nextThreshold && typeof pointsTally === 'number'
      ? Math.min(100, Math.round((pointsTally / nextThreshold) * 100))
      : null;

  // With no explicit tier name, the highest threshold at or below the balance is
  // the customer's current tier.
  const derivedCurrentTier =
    currentTierName ||
    (typeof pointsTally === 'number'
      ? [...tiers]
          .reverse()
          .find(({threshold}) => (threshold ?? 0) <= pointsTally)?.name
      : null);

  return (
    <div className={clsx('flex flex-col gap-4', className)}>
      {progress !== null && nextTier && nextThreshold !== null && (
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
