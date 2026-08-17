import {
  getCreditsLogs,
  getCustomerProperties,
  getCustomerStatus,
  getLoyaltySummary,
  getPointsLogs,
  getReferralStats,
  getReferrals,
  getRewards,
  getRivoCustomerIdFromSession,
  getVipTiers,
  spendPoints,
} from '~/lib/rivo';
import type {RivoEnv} from '~/lib/rivo';

import type {Route} from './+types/($locale).api.rivo';

/*
 * Server-side proxy for Rivo's loyalty API.
 *
 * The Rivo storefront API key is shop-scoped — it can read and spend points for
 * *any* customer in the shop — so it never leaves the server, and the customer
 * id always comes from the authenticated session rather than the request.
 */

const LOADER_ACTIONS = {
  getCustomerStatus,
  getCustomerProperties,
  getVipTiers,
  getPointsLogs,
  getCreditsLogs,
  getReferrals,
  getReferralStats,
  getRewards,
  getLoyaltySummary,
} as const;

const unauthorized = (error: string) =>
  Response.json({data: null, error}, {status: 401});

export async function loader({request, context}: Route.LoaderArgs) {
  const searchParams = new URL(request.url).searchParams;
  const action = String(searchParams.get('action') || '');

  const rivoAction = LOADER_ACTIONS[action as keyof typeof LOADER_ACTIONS];

  if (!rivoAction) {
    return Response.json(
      {data: null, error: `/api/rivo: Unsupported action \`${action}\``},
      {status: 400},
    );
  }

  const {customerId, error: sessionError} =
    await getRivoCustomerIdFromSession(context);

  if (!customerId) {
    return unauthorized(`/api/rivo: ${sessionError}`);
  }

  const limit = Number(searchParams.get('limit')) || undefined;
  const page = Number(searchParams.get('page')) || undefined;

  const {data, error, status} = await rivoAction({
    env: context.env as RivoEnv,
    customerId,
    limit,
    page,
  });

  if (error) {
    console.error(`/api/rivo: ${action}:error:`, error);
    return Response.json({data: null, error}, {status: status || 500});
  }

  return Response.json({data, error: null});
}

export async function action({request, context}: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return Response.json(
      {data: null, error: '/api/rivo: Method not allowed'},
      {status: 405},
    );
  }

  let body: FormData | undefined;
  try {
    body = await request.formData();
  } catch (error) {}

  const requestedAction = String(body?.get('action') || '');

  if (requestedAction !== 'spendPoints') {
    return Response.json(
      {
        data: null,
        error: `/api/rivo: Unsupported action \`${requestedAction}\``,
      },
      {status: 400},
    );
  }

  const {customerId, error: sessionError} =
    await getRivoCustomerIdFromSession(context);

  if (!customerId) {
    return unauthorized(`/api/rivo: ${sessionError}`);
  }

  const rewardId = String(body?.get('rewardId') || '') || null;
  const points = Number(body?.get('points')) || null;
  const credits = Number(body?.get('credits')) || null;

  let fallbackVariantIds: (number | string)[] | null = null;
  const rawVariantIds = String(body?.get('variantIds') || '');
  if (rawVariantIds) {
    try {
      const parsed = JSON.parse(rawVariantIds);
      if (Array.isArray(parsed)) fallbackVariantIds = parsed;
    } catch (error) {}
  }

  const {data, error, status} = await spendPoints({
    env: context.env as RivoEnv,
    customerId,
    rewardId,
    points,
    credits,
    fallbackVariantIds,
  });

  if (error) {
    console.error('/api/rivo: spendPoints:error:', error);
    return Response.json({data: null, error}, {status: status || 500});
  }

  return Response.json({data, error: null});
}
