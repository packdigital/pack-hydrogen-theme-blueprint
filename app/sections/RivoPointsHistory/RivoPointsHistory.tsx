import clsx from 'clsx';

import {Container} from '~/components/Container';
import {RivoSkeleton, RivoStateMessage} from '~/components/Rivo';
import {
  useLocale,
  useRivoLedger,
  useRivoLoyalty,
  useRivoProgramConfig,
} from '~/hooks';
import type {RivoLedgerEntry} from '~/lib/rivo';

import {Schema} from './RivoPointsHistory.schema';
import type {RivoPointsHistoryCms} from './RivoPointsHistory.types';

const formatDate = (value?: string | null) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? null
    : date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
};

/** Rivo's `source` values are snake_case, e.g. `referral_complete`. */
const formatSource = (source?: string | null) => {
  if (!source) return null;
  return source
    .split('_')
    .map((word, index) =>
      index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word,
    )
    .join(' ');
};

const getLabel = (entry: RivoLedgerEntry) =>
  entry.note || formatSource(entry.source) || 'Activity';

const signed = (value: number, formatted: string) =>
  `${value > 0 ? '+' : ''}${formatted}`;

/**
 * Rivo's ledger carries points and credits on the same event, so show whichever
 * one actually moved. Spends come back negative; the sign is made explicit.
 */
const getAmount = (entry: RivoLedgerEntry, currencyCode: string) => {
  if (entry.amount) {
    return signed(entry.amount, entry.amount.toLocaleString());
  }
  if (entry.creditsAmount) {
    return signed(
      entry.creditsAmount,
      entry.creditsAmount.toLocaleString(undefined, {
        style: 'currency',
        currency: currencyCode,
      }),
    );
  }
  return null;
};

const getDelta = (entry: RivoLedgerEntry) =>
  entry.amount || entry.creditsAmount || 0;

export function RivoPointsHistory({cms}: {cms: RivoPointsHistoryCms}) {
  const {heading, labels, section} = cms;
  const {currency} = useLocale();
  const {
    entries,
    error,
    hasMore,
    isLoading,
    isLoadingMore,
    isLoggedIn,
    loadMore,
  } = useRivoLedger(Number(section?.limit) || 10);
  // Whether points expire, and whether earnings are held, are program settings
  // Rivo only exposes on the shop metafield — not on the Merchant API.
  const {config} = useRivoProgramConfig();
  const {customer} = useRivoLoyalty();

  const showExpiry = !!config?.perEventExpiryEnabled;
  const showPending = !!config?.orderEarningsDelaySeconds;
  const pointsExpireAt = config?.pointsExpiryEnabled
    ? formatDate(customer?.pointsExpireAt)
    : null;

  const maxWidthClass = section?.fullWidth
    ? 'max-w-none'
    : 'max-w-[var(--content-max-width)]';

  return (
    <Container container={cms.container}>
      <div
        className="px-contained py-contained"
        style={{color: section?.textColor}}
      >
        <div className={clsx('mx-auto flex flex-col gap-6', maxWidthClass)}>
          {heading && <h2 className="text-h3 text-center">{heading}</h2>}

          {!isLoggedIn ? (
            <RivoStateMessage
              loginText={labels?.signInText}
              message={
                labels?.signedOutMessage || 'Sign in to see your history.'
              }
              variant="signedOut"
            />
          ) : isLoading ? (
            <RivoSkeleton count={4} />
          ) : error ? (
            <RivoStateMessage message={error} variant="error" />
          ) : entries.length ? (
            <>
              {/* Rivo shows this warning above the activity table whenever the
                  customer has a dated balance expiry. */}
              {pointsExpireAt && (
                <p
                  className="text-body-sm rounded-lg border border-border p-4 text-center"
                  role="status"
                >
                  {(
                    labels?.expiryWarning || 'Your points expire on {{date}}.'
                  ).replace('{{date}}', pointsExpireAt)}
                </p>
              )}

              <ul className="flex flex-col divide-y divide-border border-y border-border">
                {entries.map((entry, index) => {
                  const date = formatDate(entry.appliedAt);
                  const amount = getAmount(entry, currency);
                  const delta = getDelta(entry);

                  return (
                    <li
                      key={entry.id ?? index}
                      className="flex items-center justify-between gap-4 py-4"
                    >
                      <div className="flex flex-col">
                        <p className="text-body-sm">
                          {getLabel(entry)}
                          {/* Only on stores that hold order earnings before
                            releasing them, matching Rivo's status column. */}
                          {showPending && entry.isPending && (
                            <span className="text-caption ml-2 rounded-full border border-border px-2 py-0.5 capitalize text-neutralDark">
                              {entry.status || labels?.pendingText || 'Pending'}
                            </span>
                          )}
                        </p>

                        {date && (
                          <p className="text-caption text-neutralDark">
                            {date}
                          </p>
                        )}

                        {showExpiry && (
                          <p className="text-caption text-neutralDark">
                            {formatDate(entry.expiresAt)
                              ? `Expires ${formatDate(entry.expiresAt)}`
                              : '—'}
                          </p>
                        )}
                      </div>

                      {amount && (
                        <p
                          className={clsx(
                            'text-label whitespace-nowrap',
                            delta < 0 ? 'text-neutralDark' : 'text-primary',
                          )}
                        >
                          {amount}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>

              {hasMore && (
                <button
                  className="btn-secondary mx-auto"
                  disabled={isLoadingMore}
                  onClick={loadMore}
                  type="button"
                >
                  {isLoadingMore
                    ? 'Loading…'
                    : labels?.showMoreText || 'Show more'}
                </button>
              )}
            </>
          ) : (
            <RivoStateMessage
              message={labels?.emptyMessage || 'No activity yet.'}
            />
          )}
        </div>
      </div>
    </Container>
  );
}

RivoPointsHistory.displayName = 'RivoPointsHistory';
RivoPointsHistory.Schema = Schema;
