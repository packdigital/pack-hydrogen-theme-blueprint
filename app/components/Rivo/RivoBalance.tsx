import clsx from 'clsx';

/**
 * Points / credits / lifetime-earnings tiles driven by Rivo's customer status.
 */
export function RivoBalance({
  className,
  creditsLabel = 'Store credit',
  creditsTally,
  currencyCode = 'USD',
  lifetimeLabel = 'Lifetime points',
  lifetimeTally,
  pointsLabel = 'Points balance',
  pointsTally,
  showCredits = true,
  showLifetime = false,
}: {
  className?: string;
  creditsLabel?: string;
  creditsTally?: number | null;
  currencyCode?: string;
  lifetimeLabel?: string;
  lifetimeTally?: number | null;
  pointsLabel?: string;
  pointsTally?: number | null;
  showCredits?: boolean;
  showLifetime?: boolean;
}) {
  const tiles = [
    {
      label: pointsLabel,
      value:
        typeof pointsTally === 'number' ? pointsTally.toLocaleString() : null,
      show: true,
    },
    {
      label: creditsLabel,
      // Rivo's Merchant API returns a bare credits number, so format it here.
      value:
        typeof creditsTally === 'number'
          ? creditsTally.toLocaleString(undefined, {
              style: 'currency',
              currency: currencyCode,
            })
          : null,
      show: showCredits,
    },
    {
      label: lifetimeLabel,
      value:
        typeof lifetimeTally === 'number'
          ? lifetimeTally.toLocaleString()
          : null,
      show: showLifetime,
    },
  ].filter(({show, value}) => show && value !== null);

  if (!tiles.length) return null;

  return (
    <dl
      className={clsx(
        'grid gap-4',
        tiles.length > 2 ? 'sm:grid-cols-3' : 'sm:grid-cols-2',
        className,
      )}
    >
      {tiles.map(({label, value}) => (
        <div
          key={label}
          className="flex flex-col items-center gap-1 rounded-lg border border-border p-6 text-center"
        >
          <dt className="text-label-sm text-neutralDark">{label}</dt>
          <dd className="text-h4">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

RivoBalance.displayName = 'RivoBalance';
