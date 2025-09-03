import {v4 as uuidv4} from 'uuid';
import cookieParser from 'cookie';
import type {AppLoadContext} from '@shopify/remix-oxygen';

import {PRODUCT_GROUPINGS_QUERY} from '~/data/graphql/pack/settings';
import type {Group, Page} from '~/lib/types';

/*
 * Fetches page data from Pack with all sections,
 * using recursive calls in case there are more than 25 sections
 */
export const getPage = async ({
  context,
  handle,
  pageKey = 'page',
  query,
}: {
  context: AppLoadContext;
  handle: string;
  pageKey?: string;
  query: string;
}) => {
  const {pack, storefront} = context;
  const getPageWithAllSections = async ({
    accumulatedPage,
    cursor,
  }: {
    accumulatedPage: Page | null;
    cursor: string | null;
  }): Promise<Page | undefined> => {
    const {data} = await pack.query(query, {
      variables: {
        handle,
        cursor,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
      cache: storefront.CacheLong(),
    });

    if (!data?.[pageKey]) return undefined;

    const {nodes = [], pageInfo} = {...data[pageKey].sections};
    const combinedSections = {
      nodes: [...(accumulatedPage?.sections?.nodes || []), ...nodes],
      pageInfo,
    };
    const combinedPage = {
      ...data[pageKey],
      sections: combinedSections,
    };
    if (pageInfo?.hasNextPage) {
      return getPageWithAllSections({
        accumulatedPage: combinedPage,
        cursor: pageInfo.endCursor,
      });
    }
    return combinedPage;
  };
  const page = await getPageWithAllSections({
    accumulatedPage: null,
    cursor: null,
  });
  return {[pageKey]: page};
};

const SESSION_COOKIE = 'pack_session';
const DEFAULT_EXPIRES = 365;

export const setPackCookie = async ({
  cookieDomain,
  headers,
  request,
}: {
  cookieDomain: string;
  headers: Headers;
  request: Request;
}) => {
  try {
    const cookies = cookieParser.parse(request.headers.get('Cookie') || '');

    let sessionCookie = cookies[SESSION_COOKIE];

    if (!sessionCookie) {
      sessionCookie = uuidv4();

      const daysInMs = DEFAULT_EXPIRES * 24 * 60 * 60 * 1000;
      const expiresAtInMs = Date.now() + daysInMs;
      const expiresAt = new Date(expiresAtInMs).toUTCString();

      headers.append(
        'Set-Cookie',
        `${SESSION_COOKIE}=${sessionCookie}; Path=/; Domain=${cookieDomain}; Expires=${expiresAt}; Secure;`,
      );
    }

    return {headers};
  } catch (error) {
    console.error('Error setting pack cookie', error);
    return {headers};
  }
};

export const getProductGroupings = async (context: AppLoadContext) => {
  const getAllProductGroupings = async ({
    groupings,
    cursor,
  }: {
    groupings: Group[] | null;
    cursor: string | null;
  }): Promise<Group[] | null> => {
    const {data} = await context.pack.query(PRODUCT_GROUPINGS_QUERY, {
      variables: {after: cursor},
      cache: context.storefront.CacheLong(),
    });
    if (!data?.groups) return null;

    const queriedGroupings =
      data.groups.edges?.map(({node}: {node: Group}) => node) || [];
    const {endCursor, hasNextPage} = data.groups.pageInfo || {};

    const compiledGroupings = [...(groupings || []), ...queriedGroupings];
    if (hasNextPage) {
      return getAllProductGroupings({
        groupings: compiledGroupings,
        cursor: endCursor,
      });
    }
    return compiledGroupings;
  };
  const groupings = await getAllProductGroupings({
    groupings: null,
    cursor: null,
  });
  return groupings || null;
};
