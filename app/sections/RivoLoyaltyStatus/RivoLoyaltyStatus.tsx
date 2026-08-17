import clsx from 'clsx';

import {Container} from '~/components/Container';
import {
  RivoBalance,
  RivoSkeleton,
  RivoStateMessage,
  RivoVipTiers,
} from '~/components/Rivo';
import {useRivoLoyalty} from '~/hooks';

import {Schema} from './RivoLoyaltyStatus.schema';
import type {RivoLoyaltyStatusCms} from './RivoLoyaltyStatus.types';

export function RivoLoyaltyStatus({cms}: {cms: RivoLoyaltyStatusCms}) {
  const {heading, labels, section, subtext} = cms;
  const {customer, error, isLoading, isLoggedIn, pointsTally, vipTiers} =
    useRivoLoyalty();

  const maxWidthClass = section?.fullWidth
    ? 'max-w-none'
    : 'max-w-[var(--content-max-width)]';
  const Heading = section?.aboveTheFold ? 'h1' : 'h2';

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
                'Sign in to see your points and rewards.'
              }
              variant="signedOut"
            />
          ) : isLoading ? (
            <RivoSkeleton count={2} />
          ) : error ? (
            <RivoStateMessage message={error} variant="error" />
          ) : (
            <>
              <RivoBalance
                creditsLabel={labels?.creditsLabel}
                creditsTally={customer?.creditsTally}
                lifetimeLabel={labels?.lifetimeLabel}
                lifetimeTally={customer?.lifetimeEarningsTally}
                pointsLabel={labels?.pointsLabel}
                pointsTally={pointsTally}
                showCredits={section?.showCredits !== false}
                showLifetime={!!section?.showLifetimePoints}
              />

              {section?.showVipTiers !== false && !!vipTiers.length && (
                <div className="flex flex-col gap-3">
                  {labels?.tiersHeading && (
                    <h3 className="text-h5">{labels.tiersHeading}</h3>
                  )}

                  <RivoVipTiers
                    currentTierName={customer?.vipTierName}
                    pointsTally={pointsTally}
                    tiers={vipTiers}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Container>
  );
}

RivoLoyaltyStatus.displayName = 'RivoLoyaltyStatus';
RivoLoyaltyStatus.Schema = Schema;
