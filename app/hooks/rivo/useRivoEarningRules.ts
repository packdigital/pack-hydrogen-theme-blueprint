import {useCustomer, useLoadData, useLocale} from '~/hooks';
import type {RivoEarningRule} from '~/lib/rivo';

interface RivoApiResponse<TData> {
  data: TData | null;
  error: string | null;
}

/**
 * Fetch the program's "ways to earn" rules (`GET /earning_rules`).
 *
 * Unlike the other Rivo hooks this works for guests too — the earning rules are
 * shop-scoped, and the whole point of a loyalty landing page is to show them
 * before someone signs up. When a customer *is* signed in, the request is made
 * through the authenticated route so completed rules come back marked.
 *
 * @example
 * ```js
 * const {rules, isLoading} = useRivoEarningRules();
 * ```
 */
export function useRivoEarningRules(fetchOnMount = true) {
  const customer = useCustomer();
  const {pathPrefix} = useLocale();

  const {data, error, isLoading, mutate} = useLoadData<
    RivoApiResponse<RivoEarningRule[]>
  >(fetchOnMount ? `${pathPrefix}/api/rivo?action=getEarningRules` : null);

  return {
    rules: data?.data || [],
    isLoggedIn: !!customer,
    isLoading,
    error: data?.error || (error ? 'Unable to load ways to earn.' : null),
    refresh: mutate,
  };
}
