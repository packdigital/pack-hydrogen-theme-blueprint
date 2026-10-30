import {useAnalytics} from '@shopify/hydrogen';

import type {Settings} from '~/lib/types';

/**
 * The CPRA-permitted combined "Your Privacy Choices" label must be shown with
 * the official opt-out icon (CCPA regs sec. 7014).
 *
 * NOTE: this is a faithful inline rendering of that toggle mark, not the
 * official asset file. The icon is legally specified — confirm with the client's
 * legal team whether they require the exact SVG from cppa.ca.gov.
 */
function OptOutIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 30 14"
      className="h-3.5 w-[1.875rem] shrink-0"
    >
      <rect x="0.5" y="0.5" width="29" height="13" rx="6.5" fill="#fff" />
      <path d="M15 0.5h8.5a6.5 6.5 0 0 1 0 13H15z" fill="#0066FF" />
      <circle cx="23" cy="7" r="4" fill="#fff" />
      <path
        d="M11.5 4.2 4.8 9.8M4.8 4.2l6.7 5.6"
        stroke="#0066FF"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <rect
        x="0.5"
        y="0.5"
        width="29"
        height="13"
        rx="6.5"
        fill="none"
        stroke="#0066FF"
      />
    </svg>
  );
}

/**
 * Surfaces Shopify's native consent preference center.
 *
 * Hydrogen already builds and maintains that UI via
 * `privacyBanner.showPreferences()` — it just never ships an entry point to it.
 * This is only the trigger, not a second CMP.
 *
 * California is an opt-out regime: no consent banner is required, but a
 * persistent opt-out link is, on the homepage and every page that collects
 * personal information.
 */
export function PrivacyChoices({settings}: {settings: Settings['footer']}) {
  const {privacyBanner} = useAnalytics();
  const fallbackUrl = settings?.legal?.privacyChoicesFallbackUrl;

  const handleClick = () => {
    if (privacyBanner?.showPreferences) {
      privacyBanner.showPreferences();
      return;
    }

    // The preference center lives in Shopify's banner SDK. If that hasn't
    // loaded, fall back to the configured opt-out page — a control that goes
    // nowhere isn't compliant.
    if (fallbackUrl) window.location.href = fallbackUrl;
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Your Privacy Choices"
      className="flex items-center gap-1.5"
    >
      <p className="hover-text-underline text-current">Your Privacy Choices</p>
      <OptOutIcon />
    </button>
  );
}

PrivacyChoices.displayName = 'PrivacyChoices';
