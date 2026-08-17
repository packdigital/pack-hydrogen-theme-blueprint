import {
  captureReferral,
  completeEarningRule,
  getCustomer,
  getRemoteIp,
  getEarningRules,
  getLoyaltySummary,
  getPointsLogs,
  getReferralStats,
  getReferrals,
  getRewards,
  getRivoCustomerIdFromSession,
  getUnusedRewards,
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

/**
 * Shop-scoped program config. No customer session required — a loyalty landing
 * page has to sell the program to people who haven't joined yet, which is
 * exactly what these three describe. They contain no customer data.
 */
const PUBLIC_ACTIONS = {
  getEarningRules,
  getRewards,
  getVipTiers,
} as const;

/** Everything that reads or derives from a specific customer. */
const CUSTOMER_ACTIONS = {
  getCustomer,
  getPointsLogs,
  getReferrals,
  getReferralStats,
  getUnusedRewards,
  getLoyaltySummary,
} as const;

const LOADER_ACTIONS = {...PUBLIC_ACTIONS, ...CUSTOMER_ACTIONS} as const;

/**
 * Cache the public program config at the edge. It changes only when the merchant
 * edits the program, and this route is reachable unauthenticated, so caching
 * also keeps traffic off Rivo's 15 req/s budget.
 */
const PUBLIC_CACHE_CONTROL = 'public, max-age=60, stale-while-revalidate=600';

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

  const isPublic = action in PUBLIC_ACTIONS;

  // Public actions still resolve the session when there is one, so signed-in
  // customers get their completed earning rules marked — they just don't require it.
  const {customerId, error: sessionError} =
    await getRivoCustomerIdFromSession(context);

  if (!customerId && !isPublic) {
    return unauthorized(`/api/rivo: ${sessionError}`);
  }

  const env = context.env as RivoEnv;
  const limit = Number(searchParams.get('limit')) || undefined;
  const page = Number(searchParams.get('page')) || undefined;

  let completedIds: (number | string)[] = [];
  if (customerId && action === 'getEarningRules') {
    const {data: customer} = await getCustomer({env, customerId});
    completedIds = customer?.completedEarningRuleIds || [];
  }

  const {data, error, status} = await rivoAction({
    env,
    customerId: customerId || '',
    limit,
    page,
    completedIds,
  });

  if (error) {
    console.error(`/api/rivo: ${action}:error:`, error);
    return Response.json({data: null, error}, {status: status || 500});
  }

  return Response.json(
    {data, error: null},
    // Never cache a response that was personalized with session data.
    isPublic && !customerId
      ? {headers: {'Cache-Control': PUBLIC_CACHE_CONTROL}}
      : undefined,
  );
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

  const FORM_ACTIONS = [
    'redeemReward',
    'completeEarningRule',
    'captureReferral',
  ];

  if (!FORM_ACTIONS.includes(requestedAction)) {
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

  if (requestedAction === 'captureReferral') {
    const referralCode = String(body?.get('referralCode') || '');

    if (!referralCode) {
      return Response.json(
        {data: null, error: '/api/rivo: Missing `referralCode`'},
        {status: 400},
      );
    }

    const {data, error, status} = await captureReferral({
      env: context.env as RivoEnv,
      customerId,
      referralCode,
      // From headers, not the request body.
      remoteIp: getRemoteIp(request),
    });

    if (error) {
      // Expected rejections (self-referral, already referred) are not faults.
      console.warn('/api/rivo: captureReferral:', error);
      return Response.json({data: null, error}, {status: status || 500});
    }

    return Response.json({data, error: null});
  }

  if (requestedAction === 'completeEarningRule') {
    const ruleId = String(body?.get('ruleId') || '');

    if (!ruleId) {
      return Response.json(
        {data: null, error: '/api/rivo: Missing `ruleId`'},
        {status: 400},
      );
    }

    // Only the rule id crosses the wire. The trigger, and therefore the points
    // awarded, are resolved server-side from Rivo's own rule config.
    const {data, error, status} = await completeEarningRule({
      env: context.env as RivoEnv,
      customerId,
      ruleId,
    });

    if (error) {
      console.error('/api/rivo: completeEarningRule:error:', error);
      return Response.json({data: null, error}, {status: status || 500});
    }

    return Response.json({data, error: null});
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
