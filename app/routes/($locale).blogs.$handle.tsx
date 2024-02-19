import {useLoaderData} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {AnalyticsPageType} from '@shopify/hydrogen';
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
        first: 100,
        handle,
        cursor,
      },
      cache: context.storefront.CacheShort(),
    });
    const queriedBlog = data.blog;
    const {endCursor, hasNextPage} = queriedBlog.articles.pageInfo;
    const compiledBlog = {
      ...queriedBlog,
      articles: {
        nodes: [
          ...(blog?.articles?.nodes || []),
          ...queriedBlog.articles.nodes,
        ],
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

  const shop = await getShop(context);
  const siteSettings = await getSiteSettings(context);
  const analytics = {pageType: AnalyticsPageType.blog};
  const seo = seoPayload.blog({
    page: blog,
    shop,
    siteSettings,
    url: request.url,
  });

  return json({
    analytics,
    blog,
    seo,
  });
}

export default function BlogRoute() {
  const {blog} = useLoaderData<typeof loader>();

  return (
    <div data-comp={BlogRoute.displayName}>
      <RenderSections content={blog} />
    </div>
  );
}

BlogRoute.displayName = 'BlogRoute';
