import type {AppLoadContext} from 'react-router';
import type {Pack} from '@pack/hydrogen';

import {PRODUCT_GROUPINGS_QUERY} from '~/data/graphql/pack/settings';
import type {Group, Page} from '~/lib/types';

type QueryReturn = Awaited<ReturnType<Pack['query']>>;
type PackTestInfo = QueryReturn['packTestInfo'];

type GetPageReturn<K extends string> = Record<K, Page | undefined> & {
  packTestInfo?: PackTestInfo;
};

/*
 * Fetches page data from Pack with all sections,
 * using recursive calls in case there are more than 25 sections
 */
export const getPage = async <K extends string = 'page'>({
  context,
  handle,
  pageKey = 'page' as K,
  query,
}: {
  context: AppLoadContext;
  handle: string;
  pageKey?: K;
  query: string;
}) => {
  const {pack, storefront} = context;
  let packTestInfo: PackTestInfo;
  try {
    const getPageWithAllSections = async ({
      accumulatedPage,
      cursor,
    }: {
      accumulatedPage: Page | null;
      cursor: string | null;
    }): Promise<Page | undefined> => {
      const {data, packTestInfo: queriedPackTestInfo} = await pack.query(
        query,
        {
          variables: {
            handle,
            cursor,
            country: storefront.i18n.country,
            language: storefront.i18n.language,
          },
          cache: storefront.CacheLong(),
        },
      );

      if (!data?.[pageKey]) return undefined;

      if (!packTestInfo && queriedPackTestInfo) {
        packTestInfo = queriedPackTestInfo;
      }

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
    return {[pageKey]: page, packTestInfo} as GetPageReturn<K>;
  } catch (error) {
    console.error('Error fetching page from Pack:', error);
    return {[pageKey]: undefined, packTestInfo} as GetPageReturn<K>;
  }
};

export const getProductGroupings = async (context: AppLoadContext) => {
  try {
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
  } catch (error) {
    console.error('Error fetching product groupings from Pack:', error);
    return null;
  }
};
