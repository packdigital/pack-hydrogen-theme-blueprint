import clsx from 'clsx';

import {Link} from '~/components/Link';

/**
 * Shared empty/loading/error/signed-out states for the Rivo loyalty sections,
 * so each section doesn't reinvent them.
 */
export function RivoStateMessage({
  className,
  message,
  variant = 'info',
  loginText,
  loginUrl = '/account/login',
}: {
  className?: string;
  message: string;
  variant?: 'info' | 'error' | 'signedOut';
  loginText?: string;
  loginUrl?: string;
}) {
  return (
    <div
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
      role={variant === 'error' ? 'alert' : 'status'}
      className={clsx(
        'flex flex-col items-center gap-4 rounded-lg border border-dashed p-6 text-center',
        variant === 'error' ? 'border-red-400 text-red-500' : 'border-border',
        className,
      )}
    >
      <p className="text-body-sm">{message}</p>

      {variant === 'signedOut' && (
        // `prefetch="none"`: the login route only issues an OAuth redirect, so
        // Link's default viewport prefetch just 400s on its `.data` request.
        <Link
          aria-label={loginText}
          className="btn-primary"
          prefetch="none"
          to={loginUrl}
        >
          {loginText || 'Sign in'}
        </Link>
      )}
    </div>
  );
}

RivoStateMessage.displayName = 'RivoStateMessage';

/** Skeleton rows used while a Rivo request is in flight. */
export function RivoSkeleton({
  className,
  count = 3,
}: {
  className?: string;
  count?: number;
}) {
  return (
    <div className={clsx('flex flex-col gap-3', className)} aria-hidden>
      {[...Array(count).keys()].map((index) => (
        <div
          key={index}
          className="h-16 animate-pulse rounded-lg bg-neutralLighter"
        />
      ))}
    </div>
  );
}

RivoSkeleton.displayName = 'RivoSkeleton';
