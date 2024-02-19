import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {CMS_BLOGS_QUERY} from '~/data/queries';
import {generatedSitemapFromPages} from '~/lib/utils';

export async function loader({context}: LoaderFunctionArgs) {
  const SITE_DOMAIN = context.storefront.getShopifyDomain();

  const getBlogPages: any = async ({
    first,
    pages,
    cursor,
  }: {
    first: number;
    pages: any[] | null;
    cursor: string | null;
  }) => {
    const {data} = await context.pack.query(CMS_BLOGS_QUERY, {
      variables: {first, cursor},
      cache: context.storefront.CacheShort(),
    });
    const {endCursor, hasNextPage} = data.blogs.pageInfo;
    const compiledPages = [...(pages || []), ...data.blogs.nodes];
    if (hasNextPage && compiledPages.length < 10000) {
      return getBlogPages({
        first: Math.min(10000 - compiledPages.length, 100),
        pages: compiledPages,
        cursor: endCursor,
      });
    }
    return compiledPages;
  };
  const blogs = await getBlogPages({
    first: 250,
    pages: null,
    cursor: null,
  });
  const sitemap = generatedSitemapFromPages({
    pages: blogs,
    siteUrl: SITE_DOMAIN,
    route: 'blogs',
  });

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'xml-version': '1.0',
      encoding: 'UTF-8',
    },
  });
}
