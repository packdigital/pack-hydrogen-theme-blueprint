import {useCallback} from 'react';
import clsx from 'clsx';

import {Container} from '~/components/Container';
import {
  RivoBalance,
  RivoRewardCard,
  RivoSkeleton,
  RivoStateMessage,
} from '~/components/Rivo';
import {useMenu, useRivoLoyalty, useRivoRedeem} from '~/hooks';
import type {RivoReward} from '~/lib/rivo';

import {Schema} from './RivoRewards.schema';
import type {RivoRewardsCms} from './RivoRewards.types';

const GRID_CLASSES: Record<string, string> = {
  '2': 'sm:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
  '4': 'sm:grid-cols-2 lg:grid-cols-4',
};

export function RivoRewards({cms}: {cms: RivoRewardsCms}) {
  const {heading, labels, section, subtext} = cms;
  const {openCart} = useMenu();
  const {
    creditsTally,
    error,
    isLoading,
    isLoggedIn,
    pointsTally,
    refresh,
    rewards,
  } = useRivoLoyalty();

  const {isRedeeming, redeem, result} = useRivoRedeem({
    onSuccess: (redemption) => {
      // Balances moved server-side; pull the new tallies.
      refresh();
      // Gift-card and store-credit rewards never touch the cart, so opening it
      // would be misleading.
      if (section?.openCartOnRedeem && redemption.cartStrategy !== 'none') {
        openCart();
      }
    },
  });

  const onRedeem = useCallback(
    ({reward, pointsAmount}: {reward: RivoReward; pointsAmount?: number}) => {
      redeem({reward, pointsAmount});
    },
    [redeem],
  );

  const maxWidthClass = section?.fullWidth
    ? 'max-w-none'
    : 'max-w-[var(--content-max-width)]';
  const Heading = section?.aboveTheFold ? 'h1' : 'h2';
  const gridClass = GRID_CLASSES[section?.gridColumns || '3'];

  return (
    <Container container={cms.container}>
      <div
        className="px-contained py-contained"
        style={{color: section?.textColor}}
      >
        <div className={clsx('mx-auto flex flex-col gap-6', maxWidthClass)}>
          {(heading || subtext) && (
            <div className="flex flex-col gap-2 text-center">
              {heading && <Heading className="text-h2">{heading}</Heading>}
              {subtext && <p className="text-body">{subtext}</p>}
            </div>
          )}

          {!isLoggedIn ? (
            <RivoStateMessage
              loginText={labels?.signInText}
              message={
                labels?.signedOutMessage ||
                'Sign in to redeem your points for rewards.'
              }
              variant="signedOut"
            />
          ) : isLoading ? (
            <RivoSkeleton count={3} />
          ) : error ? (
            <RivoStateMessage message={error} variant="error" />
          ) : (
            <>
              {section?.showBalance !== false && (
                <RivoBalance
                  creditsTally={creditsTally}
                  pointsTally={pointsTally}
                />
              )}

              {/* Redemption outcome. Failures still name the code when Rivo
                  already spent the points, so nothing is silently lost. */}
              {(result.message || result.error) && (
                <p
                  aria-live="polite"
                  className={clsx(
                    'text-body-sm rounded-lg border p-4 text-center',
                    result.error
                      ? 'border-red-400 text-red-500'
                      : 'border-primary',
                  )}
                  role={result.error ? 'alert' : 'status'}
                >
                  {result.error || result.message}
                </p>
              )}

              {rewards.length ? (
                <ul className={clsx('grid gap-4', gridClass)}>
                  {rewards.map((reward) => (
                    <RivoRewardCard
                      key={reward.id}
                      buttonStyle={section?.buttonStyle}
                      isRedeeming={isRedeeming}
                      onRedeem={onRedeem}
                      pointsTally={pointsTally}
                      redeemText={labels?.redeemText}
                      reward={reward}
                    />
                  ))}
                </ul>
              ) : (
                <RivoStateMessage
                  message={
                    labels?.emptyMessage ||
                    'No rewards are available right now. Check back soon.'
                  }
                />
              )}
            </>
          )}
        </div>
      </div>
    </Container>
  );
}

RivoRewards.displayName = 'RivoRewards';
RivoRewards.Schema = Schema;
