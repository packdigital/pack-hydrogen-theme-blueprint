import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {CMS_ARTICLES_QUERY} from '~/data/queries';
import {generatedSitemapFromPages, getPrimaryDomain} from '~/lib/utils';

export async function loader({context, request}: LoaderFunctionArgs) {
  const PRIMARY_DOMAIN = getPrimaryDomain({context, request});

  const getArticlePages: any = async ({
    first,
    pages,
    cursor,
  }: {
    first: number;
    pages: any[] | null;
    cursor: string | null;
  }) => {
    const {data} = await context.pack.query(CMS_ARTICLES_QUERY, {
      variables: {first, cursor},
      cache: context.storefront.CacheLong(),
    });
    const {endCursor, hasNextPage} = data.articles.pageInfo;
    const compiledPages = [...(pages || []), ...data.articles.nodes];
    if (hasNextPage && compiledPages.length < 10000) {
      return getArticlePages({
        first: Math.min(10000 - compiledPages.length, 100),
        pages: compiledPages,
        cursor: endCursor,
      });
    }
    return compiledPages;
  };
  const articles = await getArticlePages({
    first: 250,
    pages: null,
    cursor: null,
  });
  const sitemap = generatedSitemapFromPages({
    pages: articles,
    siteUrl: PRIMARY_DOMAIN,
    route: 'articles',
  });

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'xml-version': '1.0',
      encoding: 'UTF-8',
    },
  });
}
