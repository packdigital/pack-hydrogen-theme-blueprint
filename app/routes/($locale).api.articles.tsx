import {json} from '@shopify/remix-oxygen';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {BLOG_QUERY} from '~/data/queries';
import {routeHeaders} from '~/data/cache';
import type {BlogPage} from '~/lib/types';

export const headers = routeHeaders;

export async function loader({context, request}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const handle = String(searchParams.get('handle') || '');
  const limit = Number(searchParams.get('limit')) || 4;

  if (!handle)
    return json(
      {product: null, errors: ['Missing blog `handle` parameter']},
      {status: 400},
    );

  const getBlogWithAllArticles = async ({
    blog,
    cursor,
  }: {
    blog: BlogPage | null;
    cursor: string | null;
  }): Promise<BlogPage> => {
    const {data} = await context.pack.query(BLOG_QUERY, {
      variables: {
        first: 250,
        handle,
        cursor,
      },
      cache: context.storefront.CacheLong(),
    });
    if (!data?.blog) throw new Response(null, {status: 404});

    const queriedBlog = data.blog;
    const queriedBlogArticles = queriedBlog.articles;

    const queriedBlogArticlesNodes = queriedBlogArticles?.nodes || [];
    const {endCursor, hasNextPage} = queriedBlogArticles?.pageInfo || {};

    const compiledBlog = {
      ...queriedBlog,
      articles: {
        nodes: [...(blog?.articles?.nodes || []), ...queriedBlogArticlesNodes],
        pageInfo: {endCursor, hasNextPage},
      },
    };
    if (hasNextPage) {
      return getBlogWithAllArticles({
        blog: compiledBlog,
        cursor: endCursor,
      });
    }
    return compiledBlog;
  };

  const blog = await getBlogWithAllArticles({
    blog: null,
    cursor: null,
  });

  if (!blog) throw new Response(null, {status: 404});

  const sortedArticles = blog.articles.nodes.sort((articleA, articleB) => {
    return articleA.firstPublishedAt > articleB.firstPublishedAt ? -1 : 1;
  });

  return json({articles: sortedArticles.slice(0, limit)});
}
