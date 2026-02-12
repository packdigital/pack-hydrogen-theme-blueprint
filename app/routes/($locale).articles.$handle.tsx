import {useMemo} from 'react';
import {useLoaderData, redirect} from 'react-router';
import {
  AnalyticsPageType,
  getSeoMeta,
  storefrontRedirect,
} from '@shopify/hydrogen';
import {RenderSections} from '@pack/react';

import {ARTICLE_PAGE_QUERY} from '~/data/graphql/pack/article-page';
import {getPage} from '~/lib/server-utils/pack.server';
import {getShop, getSiteSettings} from '~/lib/server-utils/settings.server';
import {seoPayload} from '~/lib/server-utils/seo.server';
import {checkForTrailingEncodedSpaces} from '~/lib/server-utils/app.server';
import {routeHeaders} from '~/data/cache';
import type {ArticlePage} from '~/lib/types';

import type {Route} from './+types/($locale).articles.$handle';

export const headers = routeHeaders;

export async function loader({params, context, request}: Route.LoaderArgs) {
  const {handle, locale} = params;
  const {storefront} = context;

  if (!handle) throw new Response(null, {status: 404});

  // Check for trailing encoded spaces and redirect if needed
  const urlRedirect = checkForTrailingEncodedSpaces(request);
  if (urlRedirect) return urlRedirect;

  const {article} = await (getPage({
    context,
    handle,
    pageKey: 'article',
    query: ARTICLE_PAGE_QUERY,
  }) as Promise<{article: ArticlePage}>);

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
      getSiteSettings(context),
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
    };
  }
}

export const meta: Route.MetaFunction = ({matches}) => {
  return (
    getSeoMeta(...matches.map((match) => (match?.loaderData as any).seo)) || []
  );
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
    <div className="py-contained" data-comp="ArticleRoute">
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
          <p className="btn-text flex h-8 items-center justify-center rounded-full bg-neutralLighter px-4 text-text">
            {article.category}
          </p>
        )}
      </section>

      <RenderSections content={article} />
    </div>
  );
}
