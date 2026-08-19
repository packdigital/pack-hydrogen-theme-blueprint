import clsx from 'clsx';

import {Container} from '~/components/Container';
import {
  RivoEarningRuleCard,
  RivoSkeleton,
  RivoStateMessage,
} from '~/components/Rivo';
import {useRivoEarningRules} from '~/hooks';

import {Schema} from './RivoWaysToEarn.schema';
import type {RivoWaysToEarnCms} from './RivoWaysToEarn.types';

const GRID_CLASSES: Record<string, string> = {
  '2': 'sm:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
  '4': 'sm:grid-cols-2 lg:grid-cols-4',
};

export function RivoWaysToEarn({cms}: {cms: RivoWaysToEarnCms}) {
  const {eyebrow, heading, icons, labels, section, subtext} = cms;
  const {
    claim,
    claimError,
    claimingId,
    claimMessage,
    error,
    isLoading,
    isLoggedIn,
    rules,
  } = useRivoEarningRules();

  // Rivo has no icon field on earning rules, so icons are matched by trigger
  // from the CMS, e.g. `order_placed` -> a cart icon.
  const iconByTrigger = (icons || []).reduce<
    Record<string, {url?: string; altText?: string}>
  >((acc, {trigger, image}) => {
    if (trigger && image?.url) acc[trigger] = image;
    return acc;
  }, {});

  const maxWidthClass = section?.fullWidth
    ? 'max-w-none'
    : 'max-w-[var(--content-max-width)]';
  const Heading = section?.aboveTheFold ? 'h1' : 'h2';
  const gridClass = GRID_CLASSES[section?.gridColumns || '4'];

  return (
    <Container container={cms.container}>
      <div
        className="px-contained py-contained"
        style={{color: section?.textColor}}
      >
        <div className={clsx('mx-auto flex flex-col gap-6', maxWidthClass)}>
          {(eyebrow || heading || subtext) && (
            <div className="flex flex-col gap-2 text-center">
              {eyebrow && (
                <p className="text-caption uppercase text-neutralDark">
                  {eyebrow}
                </p>
              )}
              {heading && <Heading className="text-h2">{heading}</Heading>}
              {subtext && (
                <p className="text-body mx-auto max-w-[46rem]">{subtext}</p>
              )}
            </div>
          )}

          {isLoading ? (
            <RivoSkeleton count={4} />
          ) : error ? (
            <RivoStateMessage message={error} variant="error" />
          ) : rules.length ? (
            <>
              {(claimMessage || claimError) && (
                <p
                  aria-live="polite"
                  className={clsx(
                    'text-body-sm rounded-lg border p-4 text-center',
                    claimError
                      ? 'border-red-400 text-red-500'
                      : 'border-primary',
                  )}
                  role={claimError ? 'alert' : 'status'}
                >
                  {claimError || claimMessage}
                </p>
              )}

              <ul className={clsx('grid gap-4', gridClass)}>
                {rules.map((rule) => (
                  <RivoEarningRuleCard
                    key={rule.id}
                    claimText={labels?.claimText}
                    completedText={labels?.completedText}
                    icon={rule.trigger ? iconByTrigger[rule.trigger] : null}
                    isClaiming={claimingId === String(rule.id)}
                    isLoggedIn={isLoggedIn}
                    onClaim={claim}
                    rule={rule}
                    signInText={labels?.signInToEarnText}
                  />
                ))}
              </ul>
            </>
          ) : (
            <RivoStateMessage
              message={
                labels?.emptyMessage ||
                'Ways to earn will appear here once the program is configured.'
              }
            />
          )}
        </div>
      </div>
    </Container>
  );
}

RivoWaysToEarn.displayName = 'RivoWaysToEarn';
RivoWaysToEarn.Schema = Schema;
