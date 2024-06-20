import {useLoaderData} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import type {LoaderFunctionArgs, MetaArgs} from '@shopify/remix-oxygen';
import {AnalyticsPageType, getSeoMeta} from '@shopify/hydrogen';
import {RenderSections} from '@pack/react';

import {BLOG_QUERY} from '~/data/queries';
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
  const blogWithSortedArticles = {
    ...blog,
    articles: {
      ...blog.articles,
      nodes: sortedArticles,
    },
  };

  const shop = await getShop(context);
  const siteSettings = await getSiteSettings(context);
  const analytics = {pageType: AnalyticsPageType.blog};
  const seo = seoPayload.blog({
    page: blogWithSortedArticles,
    shop,
    siteSettings,
    url: request.url,
  });

  return json({
    analytics,
    blog: blogWithSortedArticles,
    seo,
    url: request.url,
  });
}

export const meta = ({data}: MetaArgs) => {
  return getSeoMeta(data.seo);
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
