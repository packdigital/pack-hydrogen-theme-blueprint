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

const getAmount = (entry: RivoLedgerEntry) => {
  if (entry.formatted_amount) return entry.formatted_amount;
  if (typeof entry.amount !== 'number') return null;
  // Rivo returns spends as negatives; make the sign explicit either way.
  return `${entry.amount > 0 ? '+' : ''}${entry.amount.toLocaleString()}`;
};

export function RivoPointsHistory({cms}: {cms: RivoPointsHistoryCms}) {
  const {heading, labels, section} = cms;
  const type = section?.ledgerType === 'credits' ? 'credits' : 'points';
  const {entries, error, isLoading, isLoggedIn} = useRivoLedger(
    type,
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
                const date = formatDate(entry.created_at);
                const amount = getAmount(entry);

                return (
                  <li
                    key={entry.id ?? index}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <div className="flex flex-col">
                      <p className="text-body-sm">
                        {entry.reason ||
                          entry.description ||
                          entry.action ||
                          'Activity'}
                      </p>

                      {date && (
                        <p className="text-caption text-neutralDark">{date}</p>
                      )}
                    </div>

                    {amount && (
                      <p
                        className={clsx(
                          'text-label whitespace-nowrap',
                          typeof entry.amount === 'number' && entry.amount < 0
                            ? 'text-neutralDark'
                            : 'text-primary',
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
