import clsx from 'clsx';

import {Container} from '~/components/Container';
import {RivoSkeleton, RivoStateMessage} from '~/components/Rivo';
import {useRivoLoyalty} from '~/hooks';
import type {RivoVipTier} from '~/lib/rivo';

import {Schema} from './RivoTierBenefits.schema';
import type {
  RivoTierBenefitsCms,
  TierContentCms,
} from './RivoTierBenefits.types';

/**
 * Merge CMS-authored copy onto Rivo's live tiers, matched by name.
 *
 * Rivo's `perks` array is empty unless the merchant fills it in, and it has no
 * field for a tier tagline or a benefit matrix — so thresholds and names come
 * from the API while the marketing copy comes from the customizer. Tiers present
 * in the CMS but not in Rivo are ignored, so the API stays the source of truth
 * for what tiers actually exist.
 */
const mergeTiers = (tiers: RivoVipTier[], content?: TierContentCms[]) =>
  tiers.map((tier) => {
    const match = (content || []).find(
      ({name}) =>
        name?.toLowerCase().trim() === tier.name?.toLowerCase().trim(),
    );
    return {
      ...tier,
      tagline: match?.tagline || null,
      thresholdLabel: match?.thresholdLabel || null,
      // Prefer Rivo's perks when configured; fall back to the CMS list.
      perks: tier.perks.length
        ? tier.perks
        : (match?.perks || []).map(({text}) => text || '').filter(Boolean),
      benefits: match?.benefits || [],
    };
  });

export function RivoTierBenefits({cms}: {cms: RivoTierBenefitsCms}) {
  const {
    eyebrow,
    heading,
    labels,
    matrix,
    section,
    subtext,
    tiers: tierContent,
  } = cms;
  const {customer, error, isLoading, vipTiers} = useRivoLoyalty();

  const tiers = mergeTiers(vipTiers, tierContent);
  const currentTierName = customer?.vipTierName?.toLowerCase().trim();

  const maxWidthClass = section?.fullWidth
    ? 'max-w-none'
    : 'max-w-[var(--content-max-width)]';
  const Heading = section?.aboveTheFold ? 'h1' : 'h2';

  // Matrix rows are CMS-authored: Rivo has no benefit-comparison model.
  const showMatrix = section?.showMatrix !== false && !!matrix?.length;

  return (
    <Container container={cms.container}>
      <div
        className="px-contained py-contained"
        style={{color: section?.textColor}}
      >
        <div className={clsx('mx-auto flex flex-col gap-8', maxWidthClass)}>
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
          ) : error ? (
            <RivoStateMessage message={error} variant="error" />
          ) : tiers.length ? (
            <>
              <ul
                className={clsx(
                  'grid gap-4',
                  tiers.length >= 4
                    ? 'sm:grid-cols-2 lg:grid-cols-4'
                    : 'sm:grid-cols-2 lg:grid-cols-3',
                )}
              >
                {tiers.map((tier, index) => {
                  const isCurrent =
                    !!currentTierName &&
                    tier.name?.toLowerCase().trim() === currentTierName;

                  return (
                    <li
                      key={tier.id ?? tier.name ?? index}
                      className={clsx(
                        'flex flex-col gap-3 rounded-lg border p-5',
                        isCurrent
                          ? 'border-primary bg-neutralLightest'
                          : 'border-border',
                      )}
                    >
                      <p className="text-caption uppercase text-neutralDark">
                        {tier.thresholdLabel ||
                          (tier.threshold
                            ? `${tier.threshold.toLocaleString()}+ points`
                            : labels?.freeTierLabel || 'Free to join')}
                      </p>

                      <p className="text-h5">{tier.name}</p>

                      {tier.tagline && (
                        <p className="text-body-sm text-neutralDark">
                          {tier.tagline}
                        </p>
                      )}

                      {isCurrent && (
                        <p className="text-caption text-primary">
                          {labels?.currentTierText || 'Your current tier'}
                        </p>
                      )}

                      {!!tier.perks.length && (
                        <ul className="mt-1 flex flex-col gap-1.5">
                          {tier.perks.map((perk, perkIndex) => (
                            <li
                              key={perkIndex}
                              className="text-body-sm text-neutralDark"
                            >
                              {perk}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>

              {showMatrix && (
                /* Wide tables must scroll inside their own container. */
                <div className="-mx-4 overflow-x-auto px-4">
                  <table className="w-full min-w-[36rem] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-label-sm py-3 pr-4 font-normal">
                          {labels?.matrixHeading || 'Benefits'}
                        </th>
                        {tiers.map((tier, index) => (
                          <th
                            key={tier.id ?? index}
                            className="text-label-sm px-4 py-3 text-center"
                          >
                            {tier.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {matrix!.map((row, rowIndex) => (
                        <tr
                          key={rowIndex}
                          className="border-b border-border last:border-0"
                        >
                          <th
                            className="text-body-sm py-3 pr-4 font-normal"
                            scope="row"
                          >
                            {row.label}
                          </th>
                          {tiers.map((tier, tierIndex) => {
                            const value = tier.benefits.find(
                              ({label}) =>
                                label?.toLowerCase().trim() ===
                                row.label?.toLowerCase().trim(),
                            )?.value;

                            return (
                              <td
                                key={tier.id ?? tierIndex}
                                className="text-body-sm px-4 py-3 text-center"
                              >
                                {value === 'true' ? (
                                  <span
                                    aria-label={
                                      labels?.includedText || 'Included'
                                    }
                                    className="text-primary"
                                    role="img"
                                  >
                                    ✓
                                  </span>
                                ) : (
                                  <span
                                    className={clsx(
                                      !value && 'text-neutralMedium',
                                    )}
                                  >
                                    {value || '—'}
                                  </span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            <RivoStateMessage
              message={
                labels?.emptyMessage ||
                'VIP tiers will appear here once they are configured in Rivo.'
              }
            />
          )}
        </div>
      </div>
    </Container>
  );
}

RivoTierBenefits.displayName = 'RivoTierBenefits';
RivoTierBenefits.Schema = Schema;
