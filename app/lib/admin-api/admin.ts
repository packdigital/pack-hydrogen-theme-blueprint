import {
  getShopifyCookies,
  SHOPIFY_S,
  SHOPIFY_Y,
  SHOPIFY_STOREFRONT_ID_HEADER,
  SHOPIFY_STOREFRONT_Y_HEADER,
  SHOPIFY_STOREFRONT_S_HEADER,
} from '@shopify/hydrogen-react';
import type {WritableDeep} from 'type-fest';
import type {
  CountryCode,
  LanguageCode,
} from '@shopify/hydrogen-react/storefront-api-types';
import type {
  ClientReturn,
  ClientVariablesInRestParams,
  GenericVariables,
} from '@shopify/hydrogen-codegen';
import {
  CacheNone,
  CacheLong,
  CacheShort,
  CacheCustom,
  generateCacheControlHeader,
} from '@shopify/hydrogen';
import type {CachingStrategy} from '@shopify/hydrogen';

import {createAdminClient as createAdminUtilities} from './admin-client';
import type {AdminClientProps} from './admin-client';
import {fetchWithServerCache} from './cache/server-fetch';
import {CacheDefault} from './cache/strategies';
import {parseJSON} from './utils/parse-json';
import {warnOnce} from './utils/warning';
import {
  minifyQuery,
  assertQuery,
  assertMutation,
  throwErrorWithGqlLink,
  GraphQLError,
  type GraphQLApiResponse,
  type GraphQLErrorOptions,
} from './utils/graphql';
import {
  getCallerStackLine,
  withSyncStack,
  type StackInfo,
} from './utils/callsites';
import {
  LIB_VERSION,
  ADMIN_ACCESS_TOKEN_HEADER,
  STOREFRONT_REQUEST_GROUP_ID_HEADER,
} from './constants';
import type {WaitUntil, AdminHeaders} from './types';

export type I18nBase = {
  language: LanguageCode;
  country: CountryCode;
};

// When passing GraphQLError through Remix' `json` or `defer`,
// the class instance is lost and it becomes a plain JSON object.
// Therefore, we need make TS think this is a plain object instead of
// a class to make it work in server and client.
// Also, Remix' `Jsonify` type is broken and can't infer types of classes properly.
type JsonGraphQLError = ReturnType<GraphQLError['toJSON']>; // Equivalent to `Jsonify<GraphQLError>[]`
export type AdminApiErrors = JsonGraphQLError[] | undefined;

type AdminError = {
  errors?: AdminApiErrors;
};

/**
 * Wraps all the returned utilities from `createAdminClient`.
 */
export type AdminClient<TI18n extends I18nBase> = {
  admin: Admin<TI18n>;
};

/**
 * Maps all the queries found in the project to variables and return types.
 */
export interface AdminQueries {
  // Example of how a generated query type looks like:
  // '#graphql query q1 {...}': {return: Q1Query; variables: Q1QueryVariables};
}

/**
 * Maps all the mutations found in the project to variables and return types.
 */
export interface AdminMutations {
  // Example of how a generated mutation type looks like:
  // '#graphql mutation m1 {...}': {return: M1Mutation; variables: M1MutationVariables};
}

// These are the variables that are automatically added to the admin API.
// We use this type to make parameters optional in admin client
// when these are the only variables that can be passed.
type AutoAddedVariableNames = 'country' | 'language';

type AdminCommonExtraParams = {
  headers?: HeadersInit;
  adminApiVersion?: string;
  displayName?: string;
};

/**
 * Interface to interact with the Admin API.
 */
export type Admin<TI18n extends I18nBase = I18nBase> = {
  query: <OverrideReturnType = never, RawGqlString extends string = string>(
    query: RawGqlString,
    ...options: ClientVariablesInRestParams<
      AdminQueries,
      RawGqlString,
      AdminCommonExtraParams & Pick<AdminQueryOptions, 'cache'>,
      AutoAddedVariableNames
    >
  ) => Promise<
    ClientReturn<AdminQueries, RawGqlString, OverrideReturnType> & AdminError
  >;
  mutate: <OverrideReturnType = never, RawGqlString extends string = string>(
    mutation: RawGqlString,
    ...options: ClientVariablesInRestParams<
      AdminMutations,
      RawGqlString,
      AdminCommonExtraParams,
      AutoAddedVariableNames
    >
  ) => Promise<
    ClientReturn<AdminMutations, RawGqlString, OverrideReturnType> & AdminError
  >;
  cache?: Cache;
  CacheNone: typeof CacheNone;
  CacheLong: typeof CacheLong;
  CacheShort: typeof CacheShort;
  CacheCustom: typeof CacheCustom;
  generateCacheControlHeader: typeof generateCacheControlHeader;
  getPrivateTokenHeaders: ReturnType<
    typeof createAdminUtilities
  >['getPrivateTokenHeaders'];
  getShopifyDomain: ReturnType<typeof createAdminUtilities>['getShopifyDomain'];
  getApiUrl: ReturnType<typeof createAdminUtilities>['getAdminApiUrl'];
  i18n: TI18n;
};

type HydrogenAdminClientProps<TI18n> = {
  /** Admin API headers. */
  adminHeaders?: AdminHeaders;
  /** An instance that implements the [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache) */
  cache?: Cache;
  /** The globally unique identifier for the Shop */
  storefrontId?: string;
  /** The `waitUntil` function is used to keep the current request/response lifecycle alive even after a response has been sent. It should be provided by your platform. */
  waitUntil?: WaitUntil;
  /** An object containing a country code and language code */
  i18n?: TI18n;
  /** Whether it should print GraphQL errors automatically. Defaults to true */
  logErrors?: boolean | ((error?: Error) => boolean);
};

export type CreateAdminClientOptions<TI18n extends I18nBase> =
  HydrogenAdminClientProps<TI18n> & AdminClientProps;

type AdminQueryOptions = AdminCommonExtraParams & {
  query: string;
  mutation?: never;
  cache?: CachingStrategy;
};

type AdminMutationOptions = AdminCommonExtraParams & {
  query?: never;
  mutation: string;
  cache?: never;
};

const defaultI18n: I18nBase = {language: 'EN', country: 'US'};

/**
 *  This function extends `createAdminClient` from admin-client.ts */
export function createAdminClient<TI18n extends I18nBase>(
  options: CreateAdminClientOptions<TI18n>,
): AdminClient<TI18n> {
  const {
    adminHeaders,
    cache,
    waitUntil,
    i18n,
    storefrontId,
    logErrors = true,
    ...clientOptions
  } = options;
  const H2_PREFIX_WARN = '[h2:warn:createAdminClient] ';

  if (process.env.NODE_ENV === 'development' && !cache) {
    warnOnce(
      H2_PREFIX_WARN +
        'Admin API client created without a cache instance. This may slow down your sub-requests.',
    );
  }

  const {getPrivateTokenHeaders, getAdminApiUrl, getShopifyDomain} =
    createAdminUtilities(clientOptions);

  const getHeaders = getPrivateTokenHeaders;

  const defaultHeaders = getHeaders({
    contentType: 'json',
    buyerIp: adminHeaders?.buyerIp || '',
  });

  if (storefrontId) defaultHeaders[SHOPIFY_STOREFRONT_ID_HEADER] = storefrontId;
  if (LIB_VERSION) defaultHeaders['user-agent'] = `Admin ${LIB_VERSION}`;

  if (adminHeaders && adminHeaders.cookie) {
    const cookies = getShopifyCookies(adminHeaders.cookie ?? '');

    if (cookies[SHOPIFY_Y])
      defaultHeaders[SHOPIFY_STOREFRONT_Y_HEADER] = cookies[SHOPIFY_Y];
    if (cookies[SHOPIFY_S])
      defaultHeaders[SHOPIFY_STOREFRONT_S_HEADER] = cookies[SHOPIFY_S];
  }

  // Remove any headers that are identifiable to the user or request
  const cacheKeyHeader = JSON.stringify({
    'content-type': defaultHeaders['content-type'],
    'user-agent': defaultHeaders['user-agent'],
    [ADMIN_ACCESS_TOKEN_HEADER]: defaultHeaders[ADMIN_ACCESS_TOKEN_HEADER],
  });

  async function fetchAdminApi<T = any>({
    query,
    mutation,
    variables,
    cache: cacheOptions,
    headers = [],
    adminApiVersion,
    displayName,
    stackInfo,
  }: {variables?: GenericVariables; stackInfo?: StackInfo} & (
    | AdminQueryOptions
    | AdminMutationOptions
  )): Promise<T & AdminError> {
    const userHeaders =
      headers instanceof Headers
        ? Object.fromEntries(headers.entries())
        : Array.isArray(headers)
        ? Object.fromEntries(headers)
        : headers;

    const document = query ?? mutation;
    const queryVariables = {...variables};

    if (i18n) {
      if (!variables?.country && /\$country/.test(document)) {
        queryVariables.country = i18n.country;
      }

      if (!variables?.language && /\$language/.test(document)) {
        queryVariables.language = i18n.language;
      }
    }

    const url = getAdminApiUrl({adminApiVersion});
    const graphqlData = JSON.stringify({
      query: document,
      variables: queryVariables,
    });
    const requestInit = {
      method: 'POST',
      headers: {...defaultHeaders, ...userHeaders},
      body: graphqlData,
    } satisfies RequestInit;

    const cacheKey = [
      url,
      requestInit.method,
      cacheKeyHeader,
      requestInit.body,
    ];

    const [body, response] = await fetchWithServerCache(url, requestInit, {
      cacheInstance: mutation ? undefined : cache,
      cache: cacheOptions || CacheDefault(),
      cacheKey,
      waitUntil,
      // Check if the response body has GraphQL errors:
      // https://spec.graphql.org/June2018/#sec-Response-Format
      shouldCacheResponse: (body: any) => !body?.errors,
      // Optional information for the subrequest profiler:
      debugInfo: {
        requestId: requestInit.headers[STOREFRONT_REQUEST_GROUP_ID_HEADER],
        displayName,
        url,
        stackInfo,
        graphql: graphqlData,
        purpose: adminHeaders?.purpose,
      },
    });

    const errorOptions: GraphQLErrorOptions<T> = {
      url,
      response,
      type: mutation ? 'mutation' : 'query',
      query: document,
      queryVariables,
      errors: undefined,
    };

    if (!response.ok) {
      /**
       * The Admin API might return a string error, or a JSON-formatted {error: string}.
       * We try both and conform them to a single {errors} format.
       */
      let errors;
      let bodyText = body;
      try {
        bodyText ??= await response.text();
        errors = parseJSON(bodyText);
      } catch (_e) {
        errors = [{message: bodyText ?? 'Could not parse Admin API response'}];
      }

      throwErrorWithGqlLink({...errorOptions, errors});
    }

    const {data, errors} = body as GraphQLApiResponse<T>;

    const gqlErrors = errors?.map(
      ({message, ...rest}) =>
        new GraphQLError(message, {
          ...(rest as WritableDeep<typeof rest>),
          clientOperation: `admin.${errorOptions.type}`,
          requestId: response.headers.get('x-request-id'),
          queryVariables,
          query: document,
        }),
    );

    return formatAPIResult(data, gqlErrors);
  }

  return {
    admin: {
      /**
       * Sends a GraphQL query to the Admin API.
       *
       * Example:
       *
       * ```js
       * async function loader ({context: {admin}}) {
       *   const data = await admin.query('query { ... }', {
       *     variables: {},
       *     cache: admin.CacheLong()
       *   });
       * }
       * ```
       */
      query(query, options?) {
        query = minifyQuery(query);
        assertQuery(query, 'admin.query');

        const stackOffset = getStackOffset?.(query);

        return withSyncStack(
          fetchAdminApi({
            ...options,
            query,
            stackInfo: getCallerStackLine?.(stackOffset),
          }),
          {stackOffset, logErrors},
        );
      },
      /**
       * Sends a GraphQL mutation to the Admin API.
       *
       * Example:
       *
       * ```js
       * async function loader ({context: {admin}}) {
       *   await admin.mutate('mutation { ... }', {
       *     variables: {},
       *   });
       * }
       * ```
       */
      mutate(mutation, options?) {
        mutation = minifyQuery(mutation);
        assertMutation(mutation, 'admin.mutate');

        const stackOffset = getStackOffset?.(mutation);

        return withSyncStack(
          fetchAdminApi({
            ...options,
            mutation,
            stackInfo: getCallerStackLine?.(stackOffset),
          }),
          {stackOffset, logErrors},
        );
      },
      cache,
      CacheNone,
      CacheLong,
      CacheShort,
      CacheCustom,
      generateCacheControlHeader,
      getPrivateTokenHeaders,
      getShopifyDomain,
      getApiUrl: getAdminApiUrl,
      i18n: (i18n ?? defaultI18n) as TI18n,
    },
  };
}

const getStackOffset =
  process.env.NODE_ENV === 'development'
    ? (query: string) => {
        let stackOffset = 0;
        if (/fragment CartApi(Query|Mutation) on Cart/.test(query)) {
          // The cart handler is wrapping admin.query/mutate,
          // so we need to go up one more stack frame to show
          // the caller in /subrequest-profiler
          stackOffset = 1;
        }

        return stackOffset;
      }
    : undefined;

export function formatAPIResult<T>(
  data: T,
  errors: AdminApiErrors,
): T & AdminError {
  return {
    ...data,
    ...(errors && {errors}),
  };
}
