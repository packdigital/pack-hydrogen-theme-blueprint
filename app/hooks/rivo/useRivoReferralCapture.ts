import {useEffect, useRef} from 'react';
import cookieParser from 'cookie';

import {useCustomer, useLocale} from '~/hooks';
// Direct import, not the `~/lib/rivo` barrel: that barrel re-exports
// session.server, which must not reach the client bundle.
import {
  RIVO_REFERRAL_COOKIE,
  RIVO_REFERRAL_PARAMS,
} from '~/lib/rivo/referral.constants';
import {getExpirationDate} from '~/lib/utils';

/** Referral windows are measured in weeks, not the helper's 1-day default. */
const REFERRAL_COOKIE_DAYS = 30;

/**
 * A cookie can only be deleted by a write matching its `path`, and this one is
 * set at `path=/` so it survives the trip through signup. The shared
 * `deleteCookie` helper sets no path, so it would silently fail from any page
 * other than the root — and the referral would then be retried on every load.
 */
const clearReferralCookie = () => {
  document.cookie = `${RIVO_REFERRAL_COOKIE}=; path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
};

/**
 * Capture an inbound Rivo referral and attribute it once the friend is known.
 *
 * Rivo's referral links point at the store root with `?referral_code=…`, so this
 * has to run globally rather than on the loyalty page — it is mounted in
 * `Layout`. Attribution needs the referred friend's email, which only exists
 * once they sign in or create an account, so the code is parked in a cookie
 * until then.
 *
 * The cookie is cleared after any attempt, successful or not. Rivo rejects
 * self-referrals and already-referred emails, and retrying those on every page
 * load would burn the rate limit for nothing.
 */
export function useRivoReferralCapture() {
  const customer = useCustomer();
  const {pathPrefix} = useLocale();
  // A referral is attributed once per page load at most.
  const attempted = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cookies = cookieParser.parse(document.cookie);

    const fromUrl = RIVO_REFERRAL_PARAMS.map((param) => params.get(param)).find(
      Boolean,
    );
    const referralCode = fromUrl || cookies[RIVO_REFERRAL_COOKIE];

    // Park it so it survives the trip through signup/login.
    if (fromUrl) {
      document.cookie = `${RIVO_REFERRAL_COOKIE}=${fromUrl};path=/;expires=${getExpirationDate(REFERRAL_COOKIE_DAYS)?.toUTCString()}`;
    }

    if (!referralCode || !customer || attempted.current) return;
    attempted.current = true;

    const attribute = async () => {
      try {
        const formData = new FormData();
        formData.append('action', 'captureReferral');
        formData.append('referralCode', referralCode);

        const response = await fetch(`${pathPrefix}/api/rivo`, {
          method: 'POST',
          body: formData,
        });
        const payload = (await response.json()) as {error: string | null};

        // Referral attribution is passive — nothing in the UI depends on it, so
        // failures are logged rather than surfaced.
        if (!response.ok || payload.error) {
          console.warn('Rivo referral not attributed:', payload.error);
        }
      } catch (error) {
        console.warn('Rivo referral capture failed:', error);
      } finally {
        // Cleared either way: a rejected referral will never succeed on retry.
        clearReferralCookie();
      }
    };

    attribute();
  }, [customer, pathPrefix]);
}
