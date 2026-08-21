import {useEffect, useRef} from 'react';
import {useAnalytics} from '@shopify/hydrogen';

/**
 * Honors Global Privacy Control.
 *
 * Hydrogen ships no GPC handling of its own — there are no references to
 * `globalPrivacyControl` or `Sec-GPC` anywhere in @shopify/hydrogen or
 * @shopify/hydrogen-react. California treats a GPC signal as a valid opt-out of
 * the sale/sharing of personal information, so read it and push the result into
 * Shopify's Customer Privacy API. Writing it back to the API is what makes the
 * opt-out reach every downstream consumer (Playbook, Fueled, Elevar, pixels)
 * rather than living only in this hook.
 *
 * AB 566 (California Opt Me Out Act, effective 2027-01-01) requires browsers to
 * surface an opt-out signal natively, so GPC goes from a niche signal to
 * default-available across Chrome, Safari, and Edge.
 *
 * Must be called inside `Analytics.Provider`.
 */
export function useGlobalPrivacyControl() {
  const {customerPrivacy} = useAnalytics();
  const appliedRef = useRef(false);

  useEffect(() => {
    if (!customerPrivacy || appliedRef.current) return;

    const gpc = (navigator as Navigator & {globalPrivacyControl?: boolean})
      .globalPrivacyControl;

    if (gpc !== true) return;
    // Already opted out — pushing again would just echo back through
    // `visitorConsentCollected`.
    if (customerPrivacy.saleOfDataAllowed?.() === false) return;

    appliedRef.current = true;

    // GPC is an opt-out of sale/sharing *only*. Carry the other three
    // categories through at their resolved values — seeding these from
    // `currentVisitorConsent()` would be wrong, because in a region with no
    // cookie banner those fields are `undefined` while the resolved permissions
    // are `true`, so coercing them would silently revoke analytics and
    // first-party marketing the visitor never objected to.
    customerPrivacy.setTrackingConsent?.(
      {
        marketing: Boolean(customerPrivacy.marketingAllowed?.()),
        analytics: Boolean(customerPrivacy.analyticsProcessingAllowed?.()),
        preferences: Boolean(customerPrivacy.preferencesProcessingAllowed?.()),
        sale_of_data: false,
      },
      (data) => {
        if (data?.error) {
          console.error('[consent] GPC opt-out failed:', data.error);
        }
      },
    );
  }, [customerPrivacy]);
}
