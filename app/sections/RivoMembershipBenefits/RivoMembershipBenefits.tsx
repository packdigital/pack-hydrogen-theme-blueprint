import clsx from 'clsx';

import {Container} from '~/components/Container';
import {Image} from '~/components/Image';
import {RivoSkeleton, RivoStateMessage} from '~/components/Rivo';
import {useRivoProgramConfig} from '~/hooks';

import {Schema} from './RivoMembershipBenefits.schema';
import type {RivoMembershipBenefitsCms} from './RivoMembershipBenefits.types';

const GRID_CLASSES: Record<string, string> = {
  '2': 'sm:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
  '4': 'sm:grid-cols-2 lg:grid-cols-4',
};

/**
 * Paid-membership tiers and their benefits — the headless equivalent of Rivo's
 * `lp-membership-benefits.liquid`.
 *
 * Membership has no Merchant API surface at all (verified: `/memberships`,
 * `/membership_tiers` and `/subscriptions` all 404), so the tiers come from the
 * `membership_tiers` array on Rivo's shop metafield. Renders nothing until the
 * merchant has configured membership in Rivo admin.
 *
 * Display only. Subscription management — cancel, rejoin, update payment — runs
 * through Rivo's hosted JS against a Shopify app proxy that requires an online
 * store customer session, which a headless storefront does not have. See
 * `app/lib/rivo/README.md`.
 */
export function RivoMembershipBenefits({
  cms,
}: {
  cms: RivoMembershipBenefitsCms;
}) {
  const {eyebrow, heading, labels, section, subtext, tiers: tierContent} = cms;
  const {config, isLoading} = useRivoProgramConfig();

  const tiers = (config?.membershipTiers || []).map((tier) => {
    const match = (tierContent || []).find(
      ({name}) =>
        name?.toLowerCase().trim() === tier.name?.toLowerCase().trim(),
    );
    return {...tier, tagline: match?.tagline || null, image: match?.image};
  });

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
            <RivoSkeleton count={3} />
          ) : tiers.length ? (
            <ul className={clsx('grid gap-4', gridClass)}>
              {tiers.map((tier) => (
                <li
                  key={tier.id}
                  className="flex flex-col gap-3 rounded-lg border border-border p-5"
                >
                  {tier.image?.url && (
                    <Image
                      data={{
                        altText: tier.image.altText || tier.name || '',
                        url: tier.image.url,
                      }}
                      aspectRatio="1/1"
                      className="size-12"
                      width="96"
                    />
                  )}

                  <p className="text-h5">{tier.name}</p>

                  {tier.tagline && (
                    <p className="text-body-sm text-neutralDark">
                      {tier.tagline}
                    </p>
                  )}

                  {!!tier.benefits.length && (
                    <ul className="flex flex-col gap-1.5">
                      {tier.benefits.map((benefit, index) => (
                        <li key={index} className="flex flex-col">
                          {benefit.title && (
                            <span className="text-label-sm">
                              {benefit.title}
                            </span>
                          )}
                          {benefit.description && (
                            <span className="text-body-sm text-neutralDark">
                              {benefit.description}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <RivoStateMessage
              message={
                labels?.emptyMessage ||
                'Membership tiers will appear here once they are configured in Rivo.'
              }
            />
          )}
        </div>
      </div>
    </Container>
  );
}

RivoMembershipBenefits.displayName = 'RivoMembershipBenefits';
RivoMembershipBenefits.Schema = Schema;
