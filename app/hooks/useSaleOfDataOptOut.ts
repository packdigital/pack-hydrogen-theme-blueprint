import {useEffect, useRef} from 'react';

import {
  recordSaleOfDataOptOut,
  saleOfDataOptOutReason,
  subscribeToConsentEvents,
} from '~/lib/consent';

/**
 * Saves `sale_of_data: false` to Shopify after a banner Decline or under
 * Global Privacy Control, so every reader of Shopify's consent agrees.
 *
 * - **Decline:** Shopify's banner Decline answers marketing, analytics and
 *   preferences but leaves sale_of_data blank, which `saleOfDataAllowed()`
 *   reads as allowed. This is a policy choice; Shopify's banner doesn't do it
 *   by default.
 * - **GPC:** Hydrogen ships no GPC handling, and Shopify's API applies GPC
 *   only from the second full page load. GPC covers sale and sharing only, so
 *   no other purpose is touched.
 *
 * Never writes consent on load. Before `consentStatus === 'loaded'` the API
 * answers with a placeholder (no banner, everything allowed); saving that
 * records a first-time visitor in a banner region as consenting and the banner
 * never shows. `saleOfDataOptOutReason()` returns null until the real consent
 * is in, and the write carries sale_of_data alone.
 *
 * Shopify's banner script reports `visitorConsentCollected` once consent loads
 * in every region, which also flips Hydrogen's `privacyReady`, so nothing here
 * needs to save consent to release the analytics queue.
 */
export function useSaleOfDataOptOut() {
  // Once per page: the save echoes back as `visitorConsentCollected`.
  const recordedRef = useRef(false);

  useEffect(() => {
    const check = () => {
      if (recordedRef.current || !saleOfDataOptOutReason()) return;

      recordedRef.current = true;

      recordSaleOfDataOptOut((data) => {
        if (data?.error) {
          console.error(
            '[consent] failed to record sale-of-data opt-out:',
            data.error,
          );
        }
      });
    };

    // The consent may already be loaded by the time this mounts.
    check();
    return subscribeToConsentEvents(check);
  }, []);
}
