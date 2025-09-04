import {useMemo} from 'react';
import {useLoaderData} from '@remix-run/react';
import {redirect} from '@shopify/remix-oxygen';
import {
  AnalyticsPageType,
  getSeoMeta,
  storefrontRedirect,
} from '@shopify/hydrogen';
import {RenderSections} from '@pack/react';
import type {LoaderFunctionArgs, MetaArgs} from '@shopify/remix-oxygen';
import {PackTestRoute} from '@pack/hydrogen';

import {ARTICLE_PAGE_QUERY} from '~/data/graphql/pack/article-page';
import {getPage} from '~/lib/server-utils/pack.server';
import {getShop, getSiteSettings} from '~/lib/server-utils/settings.server';
import {seoPayload} from '~/lib/server-utils/seo.server';
import {routeHeaders} from '~/data/cache';
import type {ArticlePage} from '~/lib/types';

export const headers = routeHeaders;

export async function loader({params, context, request}: LoaderFunctionArgs) {
  const {handle, locale} = params;
  const {storefront} = context;

  if (!handle) throw new Response(null, {status: 404});

  const {article, packTestInfo} = await getPage({
    context,
    handle,
    pageKey: 'article',
    query: ARTICLE_PAGE_QUERY,
    request,
  });

  if (!article) {
    const redirect = await storefrontRedirect({request, storefront});
    if (redirect.status === 301) return redirect;
    throw new Response(null, {status: 404});
  }

  if (article.blog) {
    // If the article has a blog, redirect to the new path
    const blogHandle = article.blog.handle;
    const newPath = locale
      ? `/${locale}/blogs/${blogHandle}/${handle}`
      : `/blogs/${blogHandle}/${handle}`;
    return redirect(newPath, 301);
  } else {
    // If the article exists but has no blog, don't redirect
    const [shop, siteSettings] = await Promise.all([
      getShop(context),
      getSiteSettings(context, request),
    ]);
    const analytics = {pageType: AnalyticsPageType.article};
    const seo = seoPayload.article({
      page: article,
      shop,
      siteSettings,
      url: request.url,
    });

    return {
      analytics,
      article,
      seo,
      url: request.url,
      packTestInfo,
    };
  }
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function ArticleRoute() {
  const {article} = useLoaderData<{article: ArticlePage}>();

  const atDate =
    article.firstPublishedAt || article.publishedAt || article.createdAt;
  const date = useMemo(() => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    } as Intl.DateTimeFormatOptions;
    return new Date(atDate).toLocaleDateString('en-US', options);
  }, [atDate]);

  return (
    <>
      <PackTestRoute />
      <div className="py-contained" data-comp={ArticleRoute.displayName}>
        <section
          className="px-contained mb-8 flex flex-col items-center gap-3 text-center md:mb-10"
          data-comp="article-header"
        >
          <p className="text-sm md:text-base">
            {article.author ? `${article.author} | ` : ''}
            {date}
          </p>

          <h1 className="text-h2 max-w-[60rem]">{article.title}</h1>

          {article.category && (
            <p className="btn-text flex h-8 items-center justify-center rounded-full bg-lightGray px-4 text-text">
              {article.category}
            </p>
          )}
        </section>

        <RenderSections content={article} />
      </div>
    </>
  );
}

ArticleRoute.displayName = 'ArticleRoute';
