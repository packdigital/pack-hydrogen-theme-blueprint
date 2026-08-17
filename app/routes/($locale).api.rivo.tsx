import {
  getCustomer,
  getLoyaltySummary,
  getPointsLogs,
  getReferralStats,
  getReferrals,
  getRewards,
  getRivoCustomerIdFromSession,
  getVipTiers,
  redeemReward,
} from '~/lib/rivo';
import type {RivoEnv, RivoReward} from '~/lib/rivo';

import type {Route} from './+types/($locale).api.rivo';

/*
 * Server-side proxy for Rivo's Merchant API.
 *
 * The Rivo API key is admin-scoped — it can adjust any customer's points and
 * manage the rewards catalog — so it never leaves the server, and the customer
 * id always comes from the authenticated session rather than the request.
 */

const LOADER_ACTIONS = {
  getCustomer,
  getRewards,
  getVipTiers,
  getPointsLogs,
  getReferrals,
  getReferralStats,
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

  if (requestedAction !== 'redeemReward') {
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

  const rewardId = String(body?.get('rewardId') || '');

  if (!rewardId) {
    return Response.json(
      {data: null, error: '/api/rivo: Missing `rewardId`'},
      {status: 400},
    );
  }

  const env = context.env as RivoEnv;
  const pointsAmount = Number(body?.get('pointsAmount')) || null;
  const creditsAmount = Number(body?.get('creditsAmount')) || null;

  // Look the reward up server-side rather than trusting the client's copy: the
  // variant ids and reward type decide which cart mutations run, and the points
  // price decides affordability.
  const {data: rewards} = await getRewards({env, customerId});
  const reward =
    (rewards as RivoReward[] | null)?.find(({id}) => String(id) === rewardId) ||
    null;

  if (!reward) {
    return Response.json(
      {
        data: null,
        error: '/api/rivo: That reward is not available for redemption.',
      },
      {status: 400},
    );
  }

  const {data, error, status} = await redeemReward({
    env,
    customerId,
    rewardId,
    pointsAmount: reward.isIncremental ? pointsAmount : null,
    creditsAmount: reward.isIncremental ? creditsAmount : null,
    reward,
  });

  if (error) {
    console.error('/api/rivo: redeemReward:error:', error);
    return Response.json({data: null, error}, {status: status || 500});
  }

  return Response.json({data, error: null});
}
