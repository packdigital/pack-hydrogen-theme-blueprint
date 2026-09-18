import clsx from 'clsx';

import {Image} from '~/components/Image';
import type {RivoEarningRule} from '~/lib/rivo';

/**
 * A single "way to earn" action.
 *
 * Three shapes, depending on what the rule is:
 * - **Claimable with a url** (social follows) — a link that opens in a new tab
 *   and awards the points on click.
 * - **Claimable without a url** (custom actions) — a claim button.
 * - **Automatic** (orders, birthday, signup) — a static card. Rivo awards these
 *   from its own signals, so there is nothing to click.
 *
 * Claiming is trust-based, exactly as it is in Rivo's own widgets: there is no
 * way to verify someone really followed an account. Repeat awards are prevented
 * server-side by the rule's completion state.
 */
export function RivoEarningRuleCard({
  claimText = 'Claim',
  className,
  completedText = 'Completed',
  icon,
  isClaiming,
  isLoggedIn,
  onClaim,
  rule,
  signInText = 'Sign in to earn',
}: {
  claimText?: string;
  className?: string;
  completedText?: string;
  /** Optional CMS-supplied icon, matched to the rule by trigger. */
  icon?: {url?: string; altText?: string} | null;
  isClaiming?: boolean;
  isLoggedIn?: boolean;
  onClaim?: (rule: RivoEarningRule) => void;
  rule: RivoEarningRule;
  signInText?: string;
}) {
  const canClaim = rule.isClaimable && !rule.isCompleted && !!isLoggedIn;

  const body = (
    <>
      {icon?.url && (
        <Image
          data={{altText: icon.altText || rule.title, url: icon.url}}
          aspectRatio="1/1"
          className="size-10 shrink-0"
          width="80"
        />
      )}

      <div className="flex flex-1 flex-col gap-1">
        <p className="text-label-sm">{rule.title}</p>

        {rule.description && (
          <p className="text-caption text-neutralDark">{rule.description}</p>
        )}

        {rule.earningsText && (
          <p className="text-body-sm font-bold">{rule.earningsText}</p>
        )}

        {rule.isCompleted ? (
          <p className="text-caption text-primary">{completedText}</p>
        ) : rule.isClaimable && !isLoggedIn ? (
          <p className="text-caption text-neutralDark">{signInText}</p>
        ) : null}
      </div>
    </>
  );

  const cardClass = clsx(
    'flex h-full items-start gap-4 rounded-lg border p-5 text-left',
    rule.isCompleted ? 'border-primary bg-neutralLightest' : 'border-border',
    className,
  );

  return (
    <li className="h-full">
      {rule.url ? (
        // A plain anchor rather than the Link component: this is an external
        // social URL, and the click also has to fire the award.
        <a
          aria-label={rule.buttonText || rule.title}
          className={clsx(
            cardClass,
            'transition-colors hover:bg-neutralLightest',
          )}
          href={rule.url}
          onClick={() => {
            if (canClaim) onClaim?.(rule);
          }}
          rel="noreferrer noopener"
          target="_blank"
        >
          {body}
        </a>
      ) : canClaim ? (
        <div className={clsx(cardClass, 'flex-col')}>
          <div className="flex w-full items-start gap-4">{body}</div>

          <button
            aria-label={`${claimText} ${rule.title}`}
            className="btn-secondary mt-1 w-full"
            disabled={isClaiming}
            onClick={() => onClaim?.(rule)}
            type="button"
          >
            {isClaiming ? 'Adding…' : claimText}
          </button>
        </div>
      ) : (
        <div className={cardClass}>{body}</div>
      )}
    </li>
  );
}

RivoEarningRuleCard.displayName = 'RivoEarningRuleCard';
