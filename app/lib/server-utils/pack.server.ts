import type {AppLoadContext} from 'react-router';

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
