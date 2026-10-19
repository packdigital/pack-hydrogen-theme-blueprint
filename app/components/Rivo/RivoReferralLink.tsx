import {useCallback, useState} from 'react';
import clsx from 'clsx';

/**
 * Referral link with copy-to-clipboard, plus the advocate's referral stats.
 */
export function RivoReferralLink({
  buttonStyle = 'btn-primary',
  className,
  completedCount,
  copiedText = 'Copied!',
  copyText = 'Copy link',
  pendingCount,
  referralLink,
}: {
  buttonStyle?: string;
  className?: string;
  completedCount?: number | null;
  copiedText?: string;
  copyText?: string;
  pendingCount?: number | null;
  referralLink?: string | null;
}) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(async () => {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('RivoReferralLink:copy:error:', error);
    }
  }, [referralLink]);

  if (!referralLink) return null;

  return (
    <div className={clsx('flex flex-col gap-4', className)}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          aria-label="Your referral link"
          className="input-text flex-1"
          onFocus={(event) => event.target.select()}
          readOnly
          value={referralLink}
        />

        <button
          aria-label={copyText}
          className={buttonStyle}
          onClick={copy}
          type="button"
        >
          {isCopied ? copiedText : copyText}
        </button>
      </div>

      {/* Screen readers get the copy confirmation the button only shows visually. */}
      <p aria-live="polite" className="sr-only">
        {isCopied ? copiedText : ''}
      </p>

      {(typeof completedCount === 'number' ||
        typeof pendingCount === 'number') && (
        <dl className="flex gap-6">
          {typeof completedCount === 'number' && (
            <div className="flex flex-col">
              <dt className="text-caption text-neutralDark">Completed</dt>
              <dd className="text-label">{completedCount}</dd>
            </div>
          )}

          {typeof pendingCount === 'number' && (
            <div className="flex flex-col">
              <dt className="text-caption text-neutralDark">Pending</dt>
              <dd className="text-label">{pendingCount}</dd>
            </div>
          )}
        </dl>
      )}
    </div>
  );
}

RivoReferralLink.displayName = 'RivoReferralLink';
