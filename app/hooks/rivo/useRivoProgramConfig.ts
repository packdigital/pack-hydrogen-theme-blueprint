import {useLoadData, useLocale} from '~/hooks';
import type {RivoProgramConfig} from '~/lib/rivo';

interface RivoApiResponse<TData> {
  data: TData | null;
  error: string | null;
}

/**
 * Rivo's program config, read from the shop metafield behind `/api/rivo`.
 *
 * This is how the storefront learns things the Merchant API never returns:
 * whether order earnings are held before release, whether points expire, the VIP
 * comparison table, potential-points rates and referral share channels. Rivo's
 * own Liquid blocks read the same metafield.
 *
 * Shop-scoped, guest-safe and edge-cached. `config` is `null` on a store with no
 * Admin API token or no Rivo config, so every consumer must have a default.
 *
 * @example
 * ```js
 * const {config} = useRivoProgramConfig();
 * const showExpiry = !!config?.perEventExpiryEnabled;
 * ```
 */
export function useRivoProgramConfig(fetchOnMount = true) {
  const {pathPrefix} = useLocale();

  const {data, error, isLoading, mutate} = useLoadData<
    RivoApiResponse<RivoProgramConfig>
  >(fetchOnMount ? `${pathPrefix}/api/rivo?action=getProgramConfig` : null);

  return {
    config: data?.data || null,
    isLoading,
    // Never surfaced as a user-facing error: the sections fall back to defaults.
    error: error ? 'Unable to load loyalty program config.' : null,
    refresh: mutate,
  };
}
