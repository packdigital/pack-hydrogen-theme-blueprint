import clsx from 'clsx';

import type {RivoUnusedReward} from '~/lib/rivo';

const formatDate = (value?: string | null) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? null
    : date.toLocaleDateString(undefined, {month: 'short', day: 'numeric'});
};

/**
 * Codes the customer has already paid points for but not used.
 *
 * Rendered above the reward grid so a code whose cart application failed is
 * immediately visible and re-appliable, rather than living only in a transient
 * error message. Gift-card and store-credit rewards are shown without an apply
 * button — Shopify settles those at checkout.
 */
export function RivoUnusedRewards({
  appliedCode,
  applyError,
  applyingCode,
  buttonStyle = 'btn-secondary',
  className,
  heading = 'Your unused rewards',
  onApply,
  rewards,
  subtext = 'You’ve already redeemed these. Apply one to your cart, or enter the code at checkout.',
}: {
  appliedCode?: string | null;
  applyError?: string | null;
  applyingCode?: string | null;
  buttonStyle?: string;
  className?: string;
  heading?: string;
  onApply: (reward: RivoUnusedReward) => void;
  rewards: RivoUnusedReward[];
  subtext?: string;
}) {
  if (!rewards.length) return null;

  return (
    <div
      className={clsx(
        'flex flex-col gap-4 rounded-lg border border-primary p-5',
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-label">{heading}</h3>
        {subtext && <p className="text-caption text-neutralDark">{subtext}</p>}
      </div>

      {applyError && (
        <p className="text-body-sm text-red-500" role="alert">
          {applyError}
        </p>
      )}

      <ul className="flex flex-col divide-y divide-border border-y border-border">
        {rewards.map((reward) => {
          const isApplying = applyingCode === reward.code;
          const isApplied = appliedCode === reward.code;
          const date = formatDate(reward.appliedAt);
          const expires = formatDate(reward.expiresAt);
          const settledAtCheckout = reward.cartStrategy === 'none';

          return (
            <li
              key={reward.id ?? reward.code}
              className="flex flex-wrap items-center justify-between gap-3 py-3"
            >
              <div className="flex flex-col">
                <p className="text-body-sm">{reward.name || 'Reward'}</p>

                <p className="text-caption text-neutralDark">
                  {/* The code itself is the recoverable artifact — always show it. */}
                  <span className="font-bold">{reward.code}</span>
                  {typeof reward.pointsSpent === 'number' &&
                    ` · ${reward.pointsSpent.toLocaleString()} points`}
                  {date && ` · ${date}`}
                  {expires && ` · expires ${expires}`}
                </p>
              </div>

              {settledAtCheckout ? (
                <p className="text-caption text-neutralDark">
                  Applied at checkout
                </p>
              ) : (
                <button
                  aria-label={`Apply ${reward.code} to your cart`}
                  className={clsx(buttonStyle, 'shrink-0')}
                  disabled={isApplying || isApplied}
                  onClick={() => onApply(reward)}
                  type="button"
                >
                  {isApplying
                    ? 'Applying…'
                    : isApplied
                      ? 'Applied'
                      : 'Apply to cart'}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

RivoUnusedRewards.displayName = 'RivoUnusedRewards';
