import clsx from 'clsx';

import {Container} from '~/components/Container';
import {
  RivoReferralLink,
  RivoSkeleton,
  RivoStateMessage,
} from '~/components/Rivo';
import {useRivoReferrals} from '~/hooks';

import {Schema} from './RivoReferral.schema';
import type {RivoReferralCms} from './RivoReferral.types';

export function RivoReferral({cms}: {cms: RivoReferralCms}) {
  const {heading, labels, section, subtext} = cms;
  const {error, isLoading, isLoggedIn, referrals, stats} = useRivoReferrals({
    includeReferrals: !!section?.showReferralList,
  });

  const maxWidthClass = section?.fullWidth
    ? 'max-w-none'
    : 'max-w-[var(--content-max-width)]';
  const Heading = section?.aboveTheFold ? 'h1' : 'h2';
  const referralLink = stats?.referralUrl;

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
                labels?.signedOutMessage || 'Sign in to get your referral link.'
              }
              variant="signedOut"
            />
          ) : isLoading ? (
            <RivoSkeleton count={2} />
          ) : error ? (
            <RivoStateMessage message={error} variant="error" />
          ) : referralLink ? (
            <>
              <RivoReferralLink
                buttonStyle={section?.buttonStyle}
                completedCount={stats?.completedCount}
                copiedText={labels?.copiedText}
                copyText={labels?.copyText}
                pendingCount={stats?.pendingCount}
                referralLink={referralLink}
              />

              {section?.showReferralList && !!referrals.length && (
                <ul className="flex flex-col divide-y divide-border border-y border-border">
                  {referrals.map((referral, index) => (
                    <li
                      key={referral.id ?? index}
                      className="flex items-center justify-between gap-4 py-3"
                    >
                      <p className="text-body-sm">
                        {referral.referredEmail || 'Referral'}
                      </p>

                      {referral.status && (
                        <p className="text-caption capitalize text-neutralDark">
                          {referral.status}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <RivoStateMessage
              message={
                labels?.emptyMessage ||
                'Your referral link is not available yet.'
              }
            />
          )}
        </div>
      </div>
    </Container>
  );
}

RivoReferral.displayName = 'RivoReferral';
RivoReferral.Schema = Schema;
