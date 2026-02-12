import {useLoaderData} from 'react-router';
import {
  AnalyticsPageType,
  getSeoMeta,
  storefrontRedirect,
} from '@shopify/hydrogen';
import {RenderSections} from '@pack/react';

import {BLOG_PAGE_QUERY} from '~/data/graphql/pack/blog-page';
import {getPage} from '~/lib/server-utils/pack.server';
import {getShop, getSiteSettings} from '~/lib/server-utils/settings.server';
import {seoPayload} from '~/lib/server-utils/seo.server';
import {checkForTrailingEncodedSpaces} from '~/lib/server-utils/app.server';
import {routeHeaders} from '~/data/cache';
import type {BlogPage} from '~/lib/types';

import type {Route} from './+types/($locale).blogs.$handle';

export const headers = routeHeaders;

export async function loader({params, context, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) throw new Response(null, {status: 404});

  // Check for trailing encoded spaces and redirect if needed
  const urlRedirect = checkForTrailingEncodedSpaces(request);
  if (urlRedirect) return urlRedirect;

  // if the number of articles is in the several of hundreds, consider paginating the query
  const getBlogWithAllArticles = async ({
    blog,
    cursor,
  }: {
    blog: BlogPage | null;
    cursor: string | null;
  }): Promise<BlogPage | undefined> => {
    const {pack, storefront} = context;
    const {data} = await pack.query(BLOG_PAGE_QUERY, {
      variables: {
        handle,
        articlesCursor: cursor,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
      cache: storefront.CacheLong(),
    });
    if (!data?.blog) return undefined;

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

  const [blogWithAllArticles, shop, siteSettings] = await Promise.all([
    getBlogWithAllArticles({
      blog: null,
      cursor: null,
    }),
    getShop(context),
    getSiteSettings(context),
  ]);

  if (!blogWithAllArticles) {
    const redirect = await storefrontRedirect({request, storefront});
    if (redirect.status === 301) return redirect;
    throw new Response(null, {status: 404});
  }

  let blog = blogWithAllArticles;
  if (blogWithAllArticles.sections.pageInfo.hasNextPage) {
    const {blog: blogWithAllSections} = await (getPage({
      context,
      handle,
      pageKey: 'blog',
      query: BLOG_PAGE_QUERY,
    }) as Promise<{blog: BlogPage}>);
    blog = {
      ...blogWithAllArticles,
      sections: blogWithAllSections.sections,
    };
  }

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

export const meta: Route.MetaFunction = ({matches}) => {
  return (
    getSeoMeta(...matches.map((match) => (match?.loaderData as any).seo)) || []
  );
};

export default function BlogRoute() {
  const {blog} = useLoaderData<{blog: BlogPage}>();

  return (
    <div data-comp="BlogRoute">
      <RenderSections content={blog} />
    </div>
  );
}
