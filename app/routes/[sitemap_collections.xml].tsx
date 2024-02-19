import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {CMS_COLLECTIONS_QUERY} from '~/data/queries';
import {generatedSitemapFromPages} from '~/lib/utils';

export async function loader({context}: LoaderFunctionArgs) {
  const SITE_DOMAIN = context.storefront.getShopifyDomain();

  const getCollectionPages: any = async ({
    first,
    pages,
    cursor,
  }: {
    first: number;
    pages: any[] | null;
    cursor: string | null;
  }) => {
    const {data} = await context.pack.query(CMS_COLLECTIONS_QUERY, {
      variables: {first, cursor},
      cache: context.storefront.CacheShort(),
    });
    const {endCursor, hasNextPage} = data.collectionPages.pageInfo;
    const compiledPages = [...(pages || []), ...data.collectionPages.nodes];
    if (hasNextPage && compiledPages.length < 10000) {
      return getCollectionPages({
        first: Math.min(10000 - compiledPages.length, 100),
        pages: compiledPages,
        cursor: endCursor,
      });
    }
    return compiledPages;
  };
  const collectionPages = await getCollectionPages({
    first: 250,
    pages: null,
    cursor: null,
  });
  const sitemap = generatedSitemapFromPages({
    pages: collectionPages,
    siteUrl: SITE_DOMAIN,
    route: 'collections',
  });

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'xml-version': '1.0',
      encoding: 'UTF-8',
    },
  });
}
