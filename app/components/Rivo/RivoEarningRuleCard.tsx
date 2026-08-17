import clsx from 'clsx';

import {Image} from '~/components/Image';
import {Link} from '~/components/Link';
import type {RivoEarningRule} from '~/lib/rivo';

/**
 * A single "way to earn" action.
 *
 * Rules that carry a `url` (social follows, app downloads) render as links;
 * everything else is a static card. Completed rules are marked so a signed-in
 * customer can see what's left.
 */
export function RivoEarningRuleCard({
  className,
  completedText = 'Completed',
  icon,
  rule,
}: {
  className?: string;
  completedText?: string;
  /** Optional CMS-supplied icon, matched to the rule by trigger. */
  icon?: {url?: string; altText?: string} | null;
  rule: RivoEarningRule;
}) {
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

        {rule.isCompleted && (
          <p className="text-caption text-primary">{completedText}</p>
        )}
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
        <Link
          aria-label={rule.buttonText || rule.title}
          className={clsx(
            cardClass,
            'transition-colors hover:bg-neutralLightest',
          )}
          newTab
          to={rule.url}
        >
          {body}
        </Link>
      ) : (
        <div className={cardClass}>{body}</div>
      )}
    </li>
  );
}

RivoEarningRuleCard.displayName = 'RivoEarningRuleCard';
