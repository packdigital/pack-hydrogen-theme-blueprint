import clsx from 'clsx';

import {Container} from '~/components/Container';
import {RivoSkeleton, RivoStateMessage} from '~/components/Rivo';
import {useRivoLedger} from '~/hooks';
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
  const {entries, error, isLoading, isLoggedIn} = useRivoLedger(
    Number(section?.limit) || 10,
  );

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
            <ul className="flex flex-col divide-y divide-border border-y border-border">
              {entries.map((entry, index) => {
                const date = formatDate(entry.appliedAt);
                const amount = getAmount(entry, 'USD');
                const delta = getDelta(entry);

                return (
                  <li
                    key={entry.id ?? index}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <div className="flex flex-col">
                      <p className="text-body-sm">{getLabel(entry)}</p>

                      {date && (
                        <p className="text-caption text-neutralDark">{date}</p>
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
