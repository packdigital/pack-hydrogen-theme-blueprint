import clsx from 'clsx';

import type {RivoReward} from '~/lib/rivo';

/**
 * Progress toward the cheapest reward the customer can't afford yet.
 *
 * Rivo's account dashboard block reads a `next_reward` field its widget JS
 * computes; the Merchant API has no equivalent, so it is derived here from the
 * catalog the summary already returned — no extra request.
 *
 * Renders nothing once everything is affordable: at that point the customer
 * should be looking at the reward grid, not a full progress bar.
 */
export function RivoRewardProgress({
  className,
  completedText = 'You have enough points to redeem a reward.',
  heading,
  pointsTally,
  rewards,
  subtext,
}: {
  className?: string;
  completedText?: string;
  heading?: string;
  pointsTally?: number | null;
  rewards: RivoReward[];
  subtext?: string;
}) {
  if (typeof pointsTally !== 'number') return null;

  // Incremental rewards have no fixed price — the customer chooses the spend —
  // so they can't define a "next" target.
  const nextReward = rewards
    .filter(
      (reward) =>
        reward.enabled &&
        !reward.isIncremental &&
        typeof reward.pointsAmount === 'number' &&
        reward.pointsAmount > pointsTally,
    )
    .sort((a, b) => (a.pointsAmount ?? 0) - (b.pointsAmount ?? 0))[0];

  if (!nextReward) {
    return completedText ? (
      <div className={clsx('flex flex-col gap-2', className)}>
        {heading && <h3 className="text-h5">{heading}</h3>}
        <p className="text-body-sm">{completedText}</p>
      </div>
    ) : null;
  }

  const target = nextReward.pointsAmount ?? 0;
  const progress = Math.min(100, Math.round((pointsTally / target) * 100));
  const remaining = target - pointsTally;

  return (
    <div className={clsx('flex flex-col gap-2', className)}>
      {heading && <h3 className="text-h5">{heading}</h3>}

      <p className="text-body-sm">
        {(subtext || '{{points}} points away from {{reward}}')
          .replace('{{points}}', remaining.toLocaleString())
          .replace('{{reward}}', nextReward.name)}
      </p>

      <div
        aria-label={`Progress toward ${nextReward.name}`}
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

      <div className="text-caption flex justify-between text-neutralDark">
        <span>{pointsTally.toLocaleString()}</span>
        <span>{target.toLocaleString()}</span>
      </div>
    </div>
  );
}

RivoRewardProgress.displayName = 'RivoRewardProgress';
