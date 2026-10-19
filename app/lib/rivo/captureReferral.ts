import {getCustomer} from './display';
import {rivoRequest} from './rivo-client';
import type {RivoEnv, RivoResult} from './rivo.types';

export interface RivoCapturedReferral {
  referralCode: string;
  email: string;
}

/**
 * Attribute an inbound referral to the advocate who shared the link.
 *
 * `POST /referrals` needs the *referred friend's* email, so this cannot run when
 * they merely land on the site — only once they are identified by signing in or
 * creating an account. The code is parked in a cookie in between; see
 * `RIVO_REFERRAL_COOKIE`.
 *
 * `remote_ip` is required by Rivo and comes from the request headers rather than
 * anything the client sends.
 */
export const captureReferral = async ({
  env,
  customerId,
  referralCode,
  remoteIp,
}: {
  env: RivoEnv;
  customerId: string;
  referralCode: string;
  remoteIp: string | null;
}): Promise<RivoResult<RivoCapturedReferral>> => {
  if (!referralCode) {
    return {
      status: 400,
      data: null,
      error: 'Rivo: `referralCode` is required.',
    };
  }

  const {data: customer, error: customerError} = await getCustomer({
    env,
    customerId,
  });

  if (!customer?.email) {
    return {
      status: customerError ? 500 : 400,
      data: null,
      error: customerError || 'Rivo: the customer has no email to refer.',
    };
  }

  // Sharing your own link with yourself shouldn't earn anything.
  if (
    customer.referralCode &&
    customer.referralCode.toLowerCase() === referralCode.toLowerCase()
  ) {
    return {
      status: 409,
      data: null,
      error: 'Rivo: a customer cannot refer themselves.',
    };
  }

  const result = await rivoRequest<Record<string, any>>({
    env,
    path: '/referrals',
    method: 'POST',
    body: {
      email: customer.email,
      referral_code: referralCode,
      // Rivo requires this; it is taken from request headers, never the client.
      remote_ip: remoteIp || '0.0.0.0',
    },
  });

  if (result.error) {
    return {status: result.status, data: null, error: result.error};
  }

  return {
    status: 200,
    error: null,
    data: {referralCode, email: customer.email},
  };
};

/**
 * Best-effort client IP for Rivo's `remote_ip`.
 *
 * Oxygen sets `oxygen-buyer-ip`; the others cover local dev and other proxies.
 */
export const getRemoteIp = (request: Request) =>
  request.headers.get('oxygen-buyer-ip') ||
  request.headers.get('cf-connecting-ip') ||
  request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
  null;
