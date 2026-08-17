import {useState} from 'react';
import clsx from 'clsx';

import {Image} from '~/components/Image';
import type {RivoReward} from '~/lib/rivo';

const REWARD_TYPE_LABELS: Record<string, string> = {
  fixed_amount: 'Amount off',
  percentage: 'Percent off',
  free_shipping: 'Free shipping',
  free_product: 'Free product',
  gift_card: 'Gift card',
  points_to_credit: 'Store credit',
};

/**
 * A single redeemable Rivo reward.
 *
 * Incremental rewards let the customer choose how many points to spend, bounded
 * below by the reward's points amount; fixed rewards redeem straight off.
 */
export function RivoRewardCard({
  buttonStyle = 'btn-primary',
  className,
  isRedeeming,
  onRedeem,
  pointsTally,
  reward,
  redeemText = 'Redeem',
}: {
  buttonStyle?: string;
  className?: string;
  isRedeeming?: boolean;
  onRedeem: (args: {reward: RivoReward; pointsAmount?: number}) => void;
  pointsTally?: number | null;
  reward: RivoReward;
  redeemText?: string;
}) {
  const minPoints = reward.pointsAmount || 100;
  const [pointsAmount, setPointsAmount] = useState(minPoints);

  const requiredPoints = reward.isIncremental
    ? pointsAmount
    : (reward.pointsAmount ?? 0);
  const canAfford =
    typeof pointsTally !== 'number' || pointsTally >= requiredPoints;
  const isDisabled = !!isRedeeming || !canAfford || !reward.enabled;

  const typeLabel = reward.rewardType
    ? REWARD_TYPE_LABELS[reward.rewardType]
    : null;

  return (
    <li
      className={clsx(
        'flex flex-col gap-3 rounded-lg border border-border p-5',
        className,
      )}
    >
      {reward.iconUrl && (
        <Image
          data={{altText: reward.name, url: reward.iconUrl}}
          aspectRatio="1/1"
          className="rounded-md"
          width="120"
        />
      )}

      <div className="flex flex-col gap-1">
        {typeLabel && (
          <p className="text-caption uppercase text-neutralDark">{typeLabel}</p>
        )}

        <h3 className="text-label">{reward.name}</h3>

        {reward.description && (
          <p className="text-body-sm text-neutralDark">{reward.description}</p>
        )}

        {reward.minOrderValueInCents ? (
          <p className="text-caption text-neutralDark">
            {`Minimum order of $${(reward.minOrderValueInCents / 100).toFixed(2)}`}
          </p>
        ) : null}
      </div>

      {reward.isIncremental ? (
        <label className="flex flex-col gap-1">
          <span className="input-label">Points to redeem</span>
          <input
            className="input-text"
            inputMode="numeric"
            min={minPoints}
            onChange={(event) =>
              setPointsAmount(Number(event.target.value) || 0)
            }
            step={minPoints}
            type="number"
            value={pointsAmount}
          />
        </label>
      ) : (
        <p className="text-body-sm font-bold">
          {`${(reward.pointsAmount ?? 0).toLocaleString()} points`}
        </p>
      )}

      <button
        aria-label={`${redeemText} ${reward.name}`}
        className={clsx(buttonStyle, 'mt-auto')}
        disabled={isDisabled}
        onClick={() =>
          onRedeem({
            reward,
            pointsAmount: reward.isIncremental ? pointsAmount : undefined,
          })
        }
        type="button"
      >
        {isRedeeming
          ? 'Redeeming…'
          : canAfford
            ? redeemText
            : 'Not enough points'}
      </button>
    </li>
  );
}

RivoRewardCard.displayName = 'RivoRewardCard';
