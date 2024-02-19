import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {CMS_PRODUCTS_QUERY} from '~/data/queries';
import {generatedSitemapFromPages} from '~/lib/utils';

export async function loader({context}: LoaderFunctionArgs) {
  const SITE_DOMAIN = context.storefront.getShopifyDomain();

  const getProductPages: any = async ({
    first,
    pages,
    cursor,
  }: {
    first: number;
    pages: any[] | null;
    cursor: string | null;
  }) => {
    const {data} = await context.pack.query(CMS_PRODUCTS_QUERY, {
      variables: {first, cursor},
      cache: context.storefront.CacheShort(),
    });
    const {endCursor, hasNextPage} = data.productPages.pageInfo;
    const compiledPages = [...(pages || []), ...data.productPages.nodes];
    if (hasNextPage && compiledPages.length < 10000) {
      return getProductPages({
        first: Math.min(10000 - compiledPages.length, 100),
        pages: compiledPages,
        cursor: endCursor,
      });
    }
    return compiledPages;
  };
  const productPages = await getProductPages({
    first: 250,
    pages: null,
    cursor: null,
  });
  const sitemap = generatedSitemapFromPages({
    pages: productPages,
    siteUrl: SITE_DOMAIN,
    route: 'products',
  });

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'xml-version': '1.0',
      encoding: 'UTF-8',
    },
  });
}
