import {useCallback, useState} from 'react';

import {useCustomer, useLoadData, useLocale} from '~/hooks';
import type {RivoCompletedRule, RivoEarningRule} from '~/lib/rivo';

interface RivoApiResponse<TData> {
  data: TData | null;
  error: string | null;
}

/**
 * Fetch the program's "ways to earn" rules (`GET /earning_rules`) and claim the
 * ones the storefront is allowed to award.
 *
 * Unlike the other Rivo hooks the read works for guests too — the rules are
 * shop-scoped, and a loyalty landing page needs to show them before someone
 * joins. When a customer is signed in, the request goes through the
 * authenticated route so completed rules come back marked.
 *
 * Claiming sends only the rule id. The trigger and the points amount are
 * resolved server-side from Rivo's config, so nothing the browser sends can
 * change how much is awarded.
 *
 * @example
 * ```js
 * const {rules, claim, claimingId, claimMessage} = useRivoEarningRules();
 * ```
 */
export function useRivoEarningRules(fetchOnMount = true) {
  const customer = useCustomer();
  const {pathPrefix} = useLocale();
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [claimMessage, setClaimMessage] = useState<string | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);

  const {data, error, isLoading, mutate} = useLoadData<
    RivoApiResponse<RivoEarningRule[]>
  >(fetchOnMount ? `${pathPrefix}/api/rivo?action=getEarningRules` : null);

  const claim = useCallback(
    async (rule: RivoEarningRule) => {
      if (!customer) return {claimed: false, error: 'Sign in to earn points.'};

      setClaimingId(String(rule.id));
      setClaimMessage(null);
      setClaimError(null);

      try {
        const formData = new FormData();
        formData.append('action', 'completeEarningRule');
        formData.append('ruleId', String(rule.id));

        const response = await fetch(`${pathPrefix}/api/rivo`, {
          method: 'POST',
          body: formData,
        });
        const payload = (await response.json()) as {
          data: RivoCompletedRule | null;
          error: string | null;
        };

        if (!response.ok || payload.error || !payload.data) {
          const message = payload.error || 'Unable to award points right now.';
          setClaimError(message);
          return {claimed: false, error: message};
        }

        const points = payload.data.pointsAwarded;
        setClaimMessage(
          points
            ? `${points.toLocaleString()} points added for ${payload.data.title}.`
            : `Points added for ${payload.data.title}.`,
        );
        // Re-fetch so the card flips to its completed state.
        await mutate();
        return {claimed: true, error: null};
      } catch (claimFailure) {
        console.error('useRivoEarningRules:claim:error:', claimFailure);
        const message = 'Unable to award points right now.';
        setClaimError(message);
        return {claimed: false, error: message};
      } finally {
        setClaimingId(null);
      }
    },
    [customer, mutate, pathPrefix],
  );

  return {
    rules: data?.data || [],
    isLoggedIn: !!customer,
    isLoading,
    error: data?.error || (error ? 'Unable to load ways to earn.' : null),
    /** Award a claimable rule the customer just completed. */
    claim,
    /** Rule id currently being claimed, for per-card button state. */
    claimingId,
    claimMessage,
    claimError,
    refresh: mutate,
  };
}
