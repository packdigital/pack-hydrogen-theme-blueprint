import {getCustomer, getEarningRules} from './display';
import {isClaimableTrigger, rivoRequest} from './rivo-client';
import type {RivoEarningRule, RivoEnv, RivoResult} from './rivo.types';

export interface RivoCompletedRule {
  ruleId: number | string;
  title: string;
  pointsAwarded: number | null;
}

/**
 * Award an earning rule the customer completed on the storefront.
 *
 * `POST /points_events` with the rule's own `source`. The points amount is
 * deliberately **not** sent — Rivo derives it from the matching earning rule, so
 * the client cannot influence how much is granted. Only `manual` events take an
 * explicit amount, and `manual` is not awardable here.
 *
 * Like Rivo's own widgets, this is trust-based: there is no way to verify someone
 * actually followed an account. The protections are that the rule must exist, be
 * active, be of an awardable type, and not already be completed.
 */
export const completeEarningRule = async ({
  env,
  customerId,
  ruleId,
}: {
  env: RivoEnv;
  customerId: string;
  ruleId: string | number;
}): Promise<RivoResult<RivoCompletedRule>> => {
  if (!ruleId) {
    return {status: 400, data: null, error: 'Rivo: `ruleId` is required.'};
  }

  // Look the rule up server-side rather than trusting anything from the client:
  // the trigger decides what gets awarded.
  const [rules, customer] = await Promise.all([
    getEarningRules({env, customerId}),
    getCustomer({env, customerId}),
  ]);

  if (rules.error || !rules.data) {
    return {
      status: rules.status,
      data: null,
      error: rules.error || 'Rivo: unable to load earning rules.',
    };
  }

  const rule = rules.data.find(({id}) => String(id) === String(ruleId));

  if (!rule) {
    return {
      status: 400,
      data: null,
      error: 'Rivo: that earning rule is not available.',
    };
  }

  if (!isClaimableTrigger(rule.trigger)) {
    return {
      status: 400,
      data: null,
      error: `Rivo: "${rule.title}" is awarded automatically and cannot be claimed here.`,
    };
  }

  // Rivo tracks completion itself, but check before spending a write so repeat
  // clicks are cheap and the customer gets a clear message.
  const alreadyCompleted = (customer.data?.completedEarningRuleIds || []).some(
    (id) => String(id) === String(ruleId),
  );

  if (alreadyCompleted) {
    return {
      status: 409,
      data: null,
      error: `Rivo: you have already earned points for "${rule.title}".`,
    };
  }

  const result = await rivoRequest<Record<string, any>>({
    env,
    path: '/points_events',
    method: 'POST',
    body: {
      customer_identifier: customerId,
      source: rule.trigger as string,
      // Required for custom_action and visit_url rules; ignored otherwise.
      custom_action_name: rule.customActionName || undefined,
      // Rivo emails on earning; the storefront already confirms in the UI.
      skip_email: true,
    },
  });

  if (result.error) {
    return {status: result.status, data: null, error: result.error};
  }

  return {
    status: 200,
    error: null,
    data: {
      ruleId: rule.id,
      title: rule.title,
      // Rivo applies the rule's configured amount; echo it for the confirmation.
      pointsAwarded: rule.pointsAmount,
    },
  };
};

/** Re-exported for the loader so the UI can mark which cards are claimable. */
export type {RivoEarningRule};
