import {useLoaderData} from '@remix-run/react';
import type {LoaderFunctionArgs, MetaArgs} from '@shopify/remix-oxygen';
import {AnalyticsPageType, getSeoMeta} from '@shopify/hydrogen';
import {RenderSections} from '@pack/react';

import {BLOG_PAGE_QUERY} from '~/data/graphql/pack/blog-page';
import {getShop, getSiteSettings} from '~/lib/utils';
import type {BlogPage} from '~/lib/types';
import {routeHeaders} from '~/data/cache';
import {seoPayload} from '~/lib/seo.server';

export const headers = routeHeaders;

export async function loader({params, context, request}: LoaderFunctionArgs) {
  const {handle} = params;

  // if the number of articles is in the several of hundreds, consider paginating the query
  const getBlogWithAllArticles = async ({
    blog,
    cursor,
  }: {
    blog: BlogPage | null;
    cursor: string | null;
  }): Promise<BlogPage> => {
    const {data} = await context.pack.query(BLOG_PAGE_QUERY, {
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

  const [blog, shop, siteSettings] = await Promise.all([
    getBlogWithAllArticles({
      blog: null,
      cursor: null,
    }),
    getShop(context),
    getSiteSettings(context),
  ]);

  if (!blog) throw new Response(null, {status: 404});

  const sortedArticles = blog.articles.nodes.sort((articleA, articleB) => {
    return articleA.firstPublishedAt > articleB.firstPublishedAt ? -1 : 1;
  });
  const blogWithSortedArticles = {
    ...blog,
    articles: {
      ...blog.articles,
      nodes: sortedArticles,
    },
  };

  const analytics = {pageType: AnalyticsPageType.blog};
  const seo = seoPayload.blog({
    page: blogWithSortedArticles,
    shop,
    siteSettings,
    url: request.url,
  });

  return {
    analytics,
    blog: blogWithSortedArticles,
    seo,
    url: request.url,
  };
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function BlogRoute() {
  const {blog} = useLoaderData<typeof loader>();

  return (
    <div data-comp={BlogRoute.displayName}>
      <RenderSections content={blog} />
    </div>
  );
}

BlogRoute.displayName = 'BlogRoute';
