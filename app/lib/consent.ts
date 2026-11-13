import type {VisitorConsent} from '@shopify/hydrogen';

/**
 * The visitor's stored answer per purpose. Hydrogen types
 * `currentVisitorConsent()` as booleans, but the Customer Privacy API returns
 * 'yes' / 'no', or '' when the visitor hasn't answered.
 */
export type VisitorAnswer = 'yes' | 'no' | '';

export type VisitorAnswers = {
  marketing?: VisitorAnswer;
  analytics?: VisitorAnswer;
  preferences?: VisitorAnswer;
  sale_of_data?: VisitorAnswer;
};

type CustomerPrivacyRuntime = {
  consentStatus?: string;
  currentVisitorConsent?: () => VisitorAnswers;
  shouldShowBanner?: () => boolean;
  saleOfDataRegion?: () => boolean;
  marketingAllowed?: () => boolean;
  analyticsProcessingAllowed?: () => boolean;
  preferencesProcessingAllowed?: () => boolean;
  saleOfDataAllowed?: () => boolean;
  // Hydrogen's wrapper adds the storefront config and passes the rest through,
  // so a purpose left out here keeps the visitor's existing answer.
  setTrackingConsent?: (
    consent: {sale_of_data: boolean},
    callback: (data: {error: string} | undefined) => void,
  ) => void;
};

/**
 * Reads the API off `window` rather than mounting `useCustomerPrivacy()` again.
 * Hydrogen's `Analytics.Provider` already mounts one, and a second mount races
 * it for the `window.privacyBanner` setter, which can stop the banner from
 * rendering. `useAnalytics().customerPrivacy` isn't usable either: it stays
 * null until Hydrogen's `privacyReady` flips.
 */
const getCustomerPrivacy = (): CustomerPrivacyRuntime | undefined =>
  (
    window as unknown as {
      Shopify?: {customerPrivacy?: CustomerPrivacyRuntime};
    }
  ).Shopify?.customerPrivacy;

const isAnswer = (value: VisitorAnswer | undefined) =>
  value === 'yes' || value === 'no';

/**
 * Whether the visitor answered a banner. A banner answer sets marketing,
 * analytics and preferences; Decline leaves sale_of_data blank.
 */
const hasAnsweredBanner = (answers: VisitorAnswers) =>
  [answers.marketing, answers.analytics, answers.preferences].some(isAnswer);

const DENIED: VisitorConsent = {
  marketing: false,
  analytics: false,
  preferences: false,
  sale_of_data: false,
};

/**
 * The visitor's effective consent, or null while Shopify doesn't know it yet.
 *
 * Until the API reports `consentStatus === 'loaded'` it answers with a no-data
 * placeholder: no region, `shouldShowBanner()` false and every `*Allowed()`
 * getter true. Acting on that placeholder reads as "everything allowed" in a
 * region that requires a banner, so this returns null until the real data is
 * in. Re-read on `CONSENT_EVENTS`.
 *
 * When a banner is due and the visitor hasn't answered, every purpose is
 * denied; otherwise a purpose is allowed when the visitor didn't say 'no' and
 * the API allows it.
 */
export const readConsent = (): VisitorConsent | null => {
  if (typeof window === 'undefined') return null;

  try {
    const privacy = getCustomerPrivacy();

    if (privacy?.consentStatus !== 'loaded') return null;

    const answers = privacy.currentVisitorConsent?.() ?? {};
    const bannerRequired = Boolean(privacy.shouldShowBanner?.());

    if (bannerRequired && !hasAnsweredBanner(answers)) return DENIED;

    const allowed = (
      answer: VisitorAnswer | undefined,
      getter?: () => boolean,
    ) => answer !== 'no' && Boolean(getter?.());

    const marketing = allowed(answers.marketing, privacy.marketingAllowed);

    return {
      marketing,
      analytics: allowed(answers.analytics, privacy.analyticsProcessingAllowed),
      preferences: allowed(
        answers.preferences,
        privacy.preferencesProcessingAllowed,
      ),
      // Shopify's banner Decline leaves sale_of_data blank, which
      // saleOfDataAllowed() reads as allowed. Where a banner is required, a
      // blank sale_of_data follows the visitor's marketing choice instead.
      // useSaleOfDataOptOut then records the opt-out in Shopify itself; this
      // covers the moment before the write lands.
      sale_of_data:
        bannerRequired && !answers.sale_of_data
          ? marketing && Boolean(privacy.saleOfDataAllowed?.())
          : allowed(answers.sale_of_data, privacy.saleOfDataAllowed),
    };
  } catch {
    return null;
  }
};

/**
 * Why the visitor's sale-of-data opt-out should be saved to Shopify, or null
 * when it shouldn't (or Shopify hasn't loaded the consent yet):
 * - 'decline': a banner is required and the visitor declined marketing, but
 *   Shopify left sale_of_data blank.
 * - 'gpc': the browser sends Global Privacy Control in a sale-of-data region
 *   and the visitor hasn't opted out yet. Shopify's API applies GPC only from
 *   the second full page load.
 */
export const saleOfDataOptOutReason = (): 'decline' | 'gpc' | null => {
  if (typeof window === 'undefined') return null;

  try {
    const privacy = getCustomerPrivacy();

    if (privacy?.consentStatus !== 'loaded') return null;

    const answers = privacy.currentVisitorConsent?.() ?? {};

    if (
      privacy.shouldShowBanner?.() &&
      hasAnsweredBanner(answers) &&
      answers.marketing === 'no' &&
      !answers.sale_of_data
    ) {
      return 'decline';
    }

    const gpc = (navigator as Navigator & {globalPrivacyControl?: boolean})
      .globalPrivacyControl;

    if (
      gpc === true &&
      privacy.saleOfDataRegion?.() &&
      answers.sale_of_data !== 'no'
    ) {
      return 'gpc';
    }

    return null;
  } catch {
    return null;
  }
};

/**
 * Saves `sale_of_data: false` as the visitor's answer, and nothing else, so
 * every reader of Shopify's consent (vendor scripts, Hydrogen's
 * `ccpaEnforced`) sees the opt-out.
 */
export const recordSaleOfDataOptOut = (
  callback: (data: {error: string} | undefined) => void,
) => {
  getCustomerPrivacy()?.setTrackingConsent?.({sale_of_data: false}, callback);
};

/**
 * Events after which the consent can have changed or finished loading:
 * - `consentTrackingApiLoaded`: Shopify loaded the visitor's consent data.
 * - `visitorConsentCollected`: a banner answer, or Shopify's banner script
 *   reporting the region default once loaded (also in no-banner regions).
 * - `shopifyCustomerPrivacyApiLoaded`: Hydrogen loaded the API script.
 */
export const CONSENT_EVENTS = [
  'consentTrackingApiLoaded',
  'visitorConsentCollected',
  'shopifyCustomerPrivacyApiLoaded',
] as const;

/**
 * Calls `onChange` after each consent event; returns the unsubscribe. Shopify
 * dispatches these on `document`; `window` is covered too in case a script
 * version dispatches there. Callers re-read via `readConsent()`, so a double
 * call for one event is harmless.
 */
export const subscribeToConsentEvents = (onChange: () => void) => {
  CONSENT_EVENTS.forEach((name) => {
    document.addEventListener(name, onChange);
    window.addEventListener(name, onChange);
  });

  return () => {
    CONSENT_EVENTS.forEach((name) => {
      document.removeEventListener(name, onChange);
      window.removeEventListener(name, onChange);
    });
  };
};
