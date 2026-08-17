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
 * Incremental rewards (no fixed `points_price`) get a points input bounded by
 * the reward's min/max/increment config; fixed rewards redeem straight off.
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
  onRedeem: (args: {reward: RivoReward; points?: number}) => void;
  pointsTally?: number | null;
  reward: RivoReward;
  redeemText?: string;
}) {
  const isIncremental =
    !!reward.incremental || typeof reward.points_price !== 'number';
  const minPoints = reward.min_points || reward.points_increment || 100;
  const [points, setPoints] = useState(minPoints);

  const requiredPoints = isIncremental ? points : reward.points_price || 0;
  const canAfford =
    typeof pointsTally !== 'number' || pointsTally >= requiredPoints;
  const isDisabled = !!isRedeeming || !canAfford || reward.enabled === false;

  const typeLabel = reward.reward_type
    ? REWARD_TYPE_LABELS[reward.reward_type]
    : null;

  return (
    <li
      className={clsx(
        'flex flex-col gap-3 rounded-lg border border-border p-5',
        className,
      )}
    >
      {reward.image_url && (
        <Image
          data={{altText: reward.title || 'Reward', url: reward.image_url}}
          aspectRatio="1/1"
          className="rounded-md"
          width="120"
        />
      )}

      <div className="flex flex-col gap-1">
        {typeLabel && (
          <p className="text-caption uppercase text-neutralDark">{typeLabel}</p>
        )}

        <h3 className="text-label">
          {reward.title || reward.formatted_value || 'Reward'}
        </h3>

        {reward.description && (
          <p className="text-body-sm text-neutralDark">{reward.description}</p>
        )}
      </div>

      {isIncremental ? (
        <label className="flex flex-col gap-1">
          <span className="input-label">Points to redeem</span>
          <input
            className="input-text"
            inputMode="numeric"
            max={reward.max_points ?? undefined}
            min={minPoints}
            onChange={(event) => setPoints(Number(event.target.value) || 0)}
            step={reward.points_increment ?? 1}
            type="number"
            value={points}
          />
        </label>
      ) : (
        <p className="text-body-sm font-bold">
          {`${(reward.points_price || 0).toLocaleString()} points`}
        </p>
      )}

      <button
        aria-label={`${redeemText} ${reward.title || 'reward'}`}
        className={clsx(buttonStyle, 'mt-auto')}
        disabled={isDisabled}
        onClick={() =>
          onRedeem({reward, points: isIncremental ? points : undefined})
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
