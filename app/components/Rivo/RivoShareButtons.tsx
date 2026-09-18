import clsx from 'clsx';

import type {RivoReferralSocialConfig} from '~/lib/rivo';

const CHANNEL_LABELS: Record<string, string> = {
  email: 'Email',
  sms: 'Text',
  twitter: 'X',
  facebook: 'Facebook',
  whatsapp: 'WhatsApp',
};

/**
 * Build the share target for one channel.
 *
 * Rivo lets the merchant author a message per channel; where they haven't, the
 * fallback carries the link alone so the share still works. Facebook is the
 * exception — its sharer takes only a URL and ignores any prefilled text.
 */
const buildShareUrl = (
  channel: string,
  link: string,
  social?: RivoReferralSocialConfig | null,
): string | null => {
  const encodedLink = encodeURIComponent(link);
  const withLink = (message?: string | null) =>
    encodeURIComponent(message ? `${message} ${link}` : link);

  switch (channel) {
    case 'email':
      return `mailto:?body=${withLink(null)}`;
    case 'sms':
      // `?&body=` is the form that works on both iOS and Android.
      return `sms:?&body=${withLink(social?.smsMessage)}`;
    case 'twitter':
      return `https://twitter.com/intent/tweet?url=${encodedLink}${
        social?.twitterMessage
          ? `&text=${encodeURIComponent(social.twitterMessage)}`
          : ''
      }`;
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`;
    case 'whatsapp':
      return `https://wa.me/?text=${withLink(social?.whatsappMessage)}`;
    default:
      return null;
  }
};

/**
 * Share targets for a referral link, matching the channels the merchant enabled
 * in Rivo. `link` is excluded here — the copy-to-clipboard control covers it.
 *
 * Renders nothing when no channels are configured, so a store that hasn't set
 * this up gets no empty row.
 */
export function RivoShareButtons({
  className,
  referralLink,
  social,
}: {
  className?: string;
  referralLink?: string | null;
  social?: RivoReferralSocialConfig | null;
}) {
  const channels = (social?.channels || []).filter(
    (channel) => channel !== 'link' && CHANNEL_LABELS[channel],
  );

  if (!referralLink || !channels.length) return null;

  return (
    <ul className={clsx('flex flex-wrap gap-3', className)}>
      {channels.map((channel) => {
        const href = buildShareUrl(channel, referralLink, social);
        if (!href) return null;

        return (
          <li key={channel}>
            <a
              aria-label={`Share your referral link via ${CHANNEL_LABELS[channel]}`}
              className="btn-secondary"
              href={href}
              // mailto: and sms: must stay in the same tab; the web sharers
              // should not navigate the customer away from the storefront.
              rel="noreferrer noopener"
              target={
                channel === 'email' || channel === 'sms' ? undefined : '_blank'
              }
            >
              {CHANNEL_LABELS[channel]}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

RivoShareButtons.displayName = 'RivoShareButtons';
