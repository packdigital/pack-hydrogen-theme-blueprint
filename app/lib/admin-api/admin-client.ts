import {ADMIN_API_VERSION, ADMIN_ACCESS_TOKEN_HEADER} from './constants';

export type AdminClientProps = {
  /** The host name of the domain (eg: `{shop}.myshopify.com`). */
  storeDomain?: string;
  /** The Admin API delegate access token. Refer to the [authentication](https://shopify.dev/api/admin#authentication) and [delegate access token](https://shopify.dev/apps/auth/oauth/delegate-access-tokens) documentation for more details. */
  privateAdminToken?: string;
  /** The Admin API version. This should almost always be the same as the version Hydrogen React was built for. Learn more about Shopify [API versioning](https://shopify.dev/api/usage/versioning) for more details.  */
  adminApiVersion?: string;
  /**
   * Customizes which `"content-type"` header is added when using `getPrivateTokenHeaders()`. When fetching with a `JSON.stringify()`-ed `body`, use `"json"`. When fetching with a `body` that is a plain string, use `"graphql"`. Defaults to `"json"`
   *
   * Can also be customized on a call-by-call basis by passing in `'contentType'` to `getPrivateTokenHeaders({...})`, for example: `getPrivateTokenHeaders({contentType: 'graphql'})`
   */
  contentType?: 'json' | 'graphql';
};

const MOCK_SHOP_DOMAIN = 'mock.shop';
const isMockShop = (domain: string): boolean =>
  domain.includes(MOCK_SHOP_DOMAIN);

const __HYDROGEN_DEV__ = process.env.NODE_ENV === 'development';

/**
 * The `createAdminClient()` function creates helpers that enable you to quickly query the Shopify Admin API.
 */
export function createAdminClient({
  storeDomain,
  privateAdminToken,
  adminApiVersion = ADMIN_API_VERSION,
  contentType,
}: AdminClientProps): AdminClientReturn {
  if (!storeDomain) {
    if (__HYDROGEN_DEV__) {
      storeDomain = MOCK_SHOP_DOMAIN;
      warnOnce(
        `storeDomain missing, defaulting to ${MOCK_SHOP_DOMAIN}`,
        'info',
      );
    } else {
      throw new Error(
        H2_PREFIX_ERROR +
          `\`storeDomain\` is required when creating a new Admin client in production.`,
      );
    }
  }

  if (adminApiVersion !== ADMIN_API_VERSION) {
    warnOnce(
      `The Admin API version that you're using is different than the version this build of Hydrogen React is targeting.` +
        `\nYou may run into unexpected errors if these versions don't match. Received version: "${adminApiVersion}"; expected version "${ADMIN_API_VERSION}"`,
    );
  }

  const getShopifyDomain: AdminClientReturn['getShopifyDomain'] = (
    overrideProps,
  ) => {
    const domain = overrideProps?.storeDomain ?? storeDomain;
    return domain.includes('://') ? domain : `https://${domain}`;
  };

  return {
    getShopifyDomain,
    getAdminApiUrl(overrideProps): string {
      const domain = getShopifyDomain(overrideProps);
      const apiUrl =
        domain + (domain.endsWith('/') ? 'admin/api' : '/admin/api');

      if (isMockShop(domain)) return apiUrl;

      return `${apiUrl}/${
        overrideProps?.adminApiVersion ?? adminApiVersion
      }/graphql.json`;
    },
    getPrivateTokenHeaders(overrideProps): Record<string, string> {
      if (
        !privateAdminToken &&
        !overrideProps?.privateAdminToken &&
        !isMockShop(storeDomain)
      ) {
        throw new Error(
          H2_PREFIX_ERROR +
            'You did not pass in a `privateAdminToken` while using `createAdminClient()` or `getPrivateTokenHeaders()`',
        );
      }

      const finalContentType = overrideProps?.contentType ?? contentType;

      return {
        // default to json
        'content-type':
          finalContentType === 'graphql'
            ? 'application/graphql'
            : 'application/json',
        [ADMIN_ACCESS_TOKEN_HEADER]:
          overrideProps?.privateAdminToken ?? privateAdminToken ?? '',
      };
    },
  };
}

const warnings = new Set<string>();
const H2_PREFIX_ERROR = '[h2:error:createAdminClient] ';
const warnOnce = (string: string, type: 'warn' | 'info' = 'warn'): void => {
  if (!warnings.has(string)) {
    console[type](`[h2:${type}:createAdminClient] ` + string);
    warnings.add(string);
  }
};

type OverrideTokenHeaderProps = Partial<Pick<AdminClientProps, 'contentType'>>;

type AdminClientReturn = {
  /**
   * Creates the fully-qualified URL to your myshopify.com domain.
   *
   * By default, it will use the config you passed in when calling `createAdminClient()`. However, you can override the following settings on each invocation of `getShopifyDomain({...})`:
   *
   * - `storeDomain`
   */
  getShopifyDomain: (
    props?: Partial<Pick<AdminClientProps, 'storeDomain'>>,
  ) => string;
  /**
   * Creates the fully-qualified URL to your store's GraphQL endpoint.
   *
   * By default, it will use the config you passed in when calling `createAdminClient()`. However, you can override the following settings on each invocation of `getAdminApiUrl({...})`:
   *
   * - `storeDomain`
   * - `adminApiVersion`
   */
  getAdminApiUrl: (
    props?: Partial<Pick<AdminClientProps, 'storeDomain' | 'adminApiVersion'>>,
  ) => string;
  /**
   * Returns an object that contains headers that are needed for each query to Admin API GraphQL endpoint. This method uses the private Server-to-Server token which reduces the chance of throttling but must not be exposed to clients.
   *
   * By default, it will use the config you passed in when calling `createAdminClient()`. However, you can override the following settings on each invocation of `getPrivateTokenHeaders({...})`:
   *
   * - `contentType`
   * - `privateAdminToken`
   * - `buyerIp`
   *
   * Note that `contentType` defaults to what you configured in `createAdminClient({...})` and defaults to `'json'`, but a specific call may require using `graphql`. When using `JSON.stringify()` on the `body`, use `'json'`; otherwise, use `'graphql'`.
   */
  getPrivateTokenHeaders: (
    props?: OverrideTokenHeaderProps &
      Pick<AdminClientProps, 'privateAdminToken'> & {
        /**
         * The client's IP address. Passing this to the Admin API when using a server-to-server token will help improve your store's analytics data.
         */
        buyerIp?: string;
      },
  ) => Record<string, string>;
};
