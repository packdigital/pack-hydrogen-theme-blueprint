/*
 * Constants shared by the server referral mutation and the client capture hook.
 *
 * These live apart from `captureReferral.ts` on purpose. That module reaches the
 * Rivo client and, through the package barrel, `session.server` — importing a
 * runtime value from it in client code pulls server-only modules into the browser
 * bundle and fails the build. Anything both sides need belongs here, in a module
 * with no imports of its own.
 */

/** Cookie the inbound `?referral_code=` is parked in until a customer exists. */
export const RIVO_REFERRAL_COOKIE = 'rivo_referral_code';

/** Query params Rivo's referral links use. */
export const RIVO_REFERRAL_PARAMS = ['referral_code', 'rivo_referral_code'];
