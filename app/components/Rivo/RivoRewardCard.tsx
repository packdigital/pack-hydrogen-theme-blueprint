import {useCallback, useState} from 'react';
import clsx from 'clsx';

import {Image} from '~/components/Image';
import {Link} from '~/components/Link';
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
 *
 * Redeeming is two-step. Rivo deducts the points the instant the redemption is
 * created — before the cart mutation runs, with no idempotency key — so a stray
 * click is unrecoverable. Rivo's own Liquid widget gates this behind a modal;
 * this is the same guard without the modal dependency.
 */
export function RivoRewardCard({
  buttonStyle = 'btn-primary',
  className,
  cancelText = 'Cancel',
  confirmText = 'Confirm redemption',
  currencyCode = 'USD',
  isRedeeming,
  isSignedOut,
  onRedeem,
  pointsTally,
  reward,
  redeemText = 'Redeem',
}: {
  buttonStyle?: string;
  className?: string;
  cancelText?: string;
  confirmText?: string;
  currencyCode?: string;
  isRedeeming?: boolean;
  /** Browse-only: render a sign-in link in place of the redeem control. */
  isSignedOut?: boolean;
  onRedeem: (args: {reward: RivoReward; pointsAmount?: number}) => void;
  pointsTally?: number | null;
  reward: RivoReward;
  redeemText?: string;
}) {
  const minPoints = reward.pointsAmount || 100;
  const [pointsAmount, setPointsAmount] = useState(minPoints);
  const [isConfirming, setIsConfirming] = useState(false);

  const onClick = useCallback(() => {
    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }
    setIsConfirming(false);
    onRedeem({
      reward,
      pointsAmount: reward.isIncremental ? pointsAmount : undefined,
    });
  }, [isConfirming, onRedeem, pointsAmount, reward]);

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
            {`Minimum order of ${(
              reward.minOrderValueInCents / 100
            ).toLocaleString(undefined, {
              style: 'currency',
              currency: currencyCode,
            })}`}
          </p>
        ) : null}

        {reward.minOrderQuantity ? (
          <p className="text-caption text-neutralDark">
            {`Minimum of ${reward.minOrderQuantity.toLocaleString()} ${
              reward.minOrderQuantity === 1 ? 'item' : 'items'
            } in your cart`}
          </p>
        ) : null}

        {reward.expiryMonths ? (
          <p className="text-caption text-neutralDark">
            {`Expires ${reward.expiryMonths} ${
              reward.expiryMonths === 1 ? 'month' : 'months'
            } after redeeming`}
          </p>
        ) : null}

        {/* Rendered only when the merchant enabled `show_tos` in Rivo. */}
        {reward.termsOfService && (
          <p className="text-caption text-neutralDark">
            {reward.termsOfService}
          </p>
        )}
      </div>

      {reward.isIncremental && !isSignedOut ? (
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
          {reward.isIncremental && ' and up'}
        </p>
      )}

      {isSignedOut ? (
        <Link
          aria-label={`${redeemText} — ${reward.name}`}
          className={clsx(buttonStyle, 'mt-auto text-center')}
          // The login route only issues an OAuth redirect, so there is nothing
          // worth prefetching.
          prefetch="none"
          to="/account/login"
        >
          {redeemText}
        </Link>
      ) : (
        <div className="mt-auto flex flex-col gap-2">
          {isConfirming && !isRedeeming && (
            <p className="text-caption text-neutralDark" role="status">
              {`This spends ${requiredPoints.toLocaleString()} points and can't be undone.`}
            </p>
          )}

          <button
            aria-label={
              isConfirming
                ? `${confirmText} — redeem ${reward.name}`
                : `${redeemText} ${reward.name}`
            }
            className={clsx(buttonStyle)}
            disabled={isDisabled}
            onClick={onClick}
            type="button"
          >
            {isRedeeming
              ? 'Redeeming…'
              : !canAfford
                ? 'Not enough points'
                : isConfirming
                  ? confirmText
                  : redeemText}
          </button>

          {isConfirming && !isRedeeming && (
            <button
              className="text-caption underline"
              onClick={() => setIsConfirming(false)}
              type="button"
            >
              {cancelText}
            </button>
          )}
        </div>
      )}
    </li>
  );
}

RivoRewardCard.displayName = 'RivoRewardCard';
