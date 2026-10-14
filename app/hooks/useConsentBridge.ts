import {useEffect, useRef} from 'react';
import {useAnalytics} from '@shopify/hydrogen';

/**
 * Bridges Shopify's resolved consent back into the Customer Privacy API.
 *
 * Two problems, one write.
 *
 * 1. **Hydrogen's analytics deadlock.** Hydrogen's own `<ShopifyAnalytics>`
 *    registers a consumer we don't control, `Internal_Shopify_Analytics`, and
 *    only reports it ready once its internal `privacyReady` flips. That has
 *    exactly two sources:
 *
 *      onReady: () => !consent.withPrivacyBanner && setPrivacyReady(true)
 *      onVisitorConsentCollected: () => setPrivacyReady(true)
 *
 *    With `withPrivacyBanner: true` the first is disabled, and the second is an
 *    event Shopify never dispatches in a region with no cookie banner. So the
 *    register stays un-ready, `areRegistersReady()` is permanently false, and
 *    Hydrogen parks *every* analytics event in `waitForReadyQueue` — no `dl_*`
 *    events, no vendor calls, and no Shopify analytics either.
 *
 *    Committing the resolved consent makes Shopify dispatch
 *    `visitorConsentCollected`, which flips `privacyReady` and releases the
 *    queue. This records the region's resolved default rather than inventing
 *    permission — the values are exactly what the API already reports.
 *
 * 2. **Global Privacy Control.** Hydrogen ships no GPC handling at all (no
 *    `globalPrivacyControl` or `Sec-GPC` anywhere in @shopify/hydrogen or
 *    @shopify/hydrogen-react). California treats a GPC signal as a valid opt-out
 *    of the sale/sharing of personal information, and AB 566 (effective
 *    2027-01-01) makes browsers surface it natively.
 *
 *    GPC covers sale/sharing *only*, so it overrides `sale_of_data` and nothing
 *    else — blanket-denying the rest would revoke analytics and first-party
 *    marketing the visitor never objected to.
 *
 * Skipped entirely while a banner is being shown: there we must wait for the
 * shopper's actual choice, and their interaction fires the event anyway.
 *
 * Must be called inside `Analytics.Provider`.
 */
export function useConsentBridge() {
  const {customerPrivacy} = useAnalytics();
  const committedRef = useRef(false);

  useEffect(() => {
    if (!customerPrivacy || committedRef.current) return;
    if (customerPrivacy.shouldShowBanner?.()) return;

    const gpc = (navigator as Navigator & {globalPrivacyControl?: boolean})
      .globalPrivacyControl;

    committedRef.current = true;

    customerPrivacy.setTrackingConsent?.(
      {
        marketing: Boolean(customerPrivacy.marketingAllowed?.()),
        analytics: Boolean(customerPrivacy.analyticsProcessingAllowed?.()),
        preferences: Boolean(customerPrivacy.preferencesProcessingAllowed?.()),
        sale_of_data:
          gpc === true ? false : Boolean(customerPrivacy.saleOfDataAllowed?.()),
      },
      (data) => {
        if (data?.error) {
          console.error(
            '[consent] failed to commit resolved consent:',
            data.error,
          );
        }
      },
    );
  }, [customerPrivacy]);
}
