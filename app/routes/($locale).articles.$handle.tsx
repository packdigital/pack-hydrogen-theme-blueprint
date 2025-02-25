import {useMemo} from 'react';
import {useLoaderData} from '@remix-run/react';
import {redirect} from '@shopify/remix-oxygen';
import type {LoaderFunctionArgs, MetaArgs} from '@shopify/remix-oxygen';
import {AnalyticsPageType, getSeoMeta} from '@shopify/hydrogen';
import {RenderSections} from '@pack/react';

import {ARTICLE_PAGE_QUERY} from '~/data/graphql/pack/article-page';
import {getShop, getSiteSettings} from '~/lib/utils';
import {routeHeaders} from '~/data/cache';
import {seoPayload} from '~/lib/seo.server';

export const headers = routeHeaders;

export async function loader({params, context, request}: LoaderFunctionArgs) {
  const {handle, locale} = params;
  const {data} = await context.pack.query(ARTICLE_PAGE_QUERY, {
    variables: {handle},
    cache: context.storefront.CacheLong(),
  });

  if (!data.article) throw new Response(null, {status: 404});

  if (data.article.blog) {
    // If the article has a blog, redirect to the new path
    const blogHandle = data.article.blog.handle;
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
      page: data.article,
      shop,
      siteSettings,
      url: request.url,
    });

    return {
      analytics,
      article: data.article,
      seo,
      url: request.url,
    };
  }
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function ArticleRoute() {
  const {article} = useLoaderData<typeof loader>();

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
          <p className="btn-text flex h-8 items-center justify-center rounded-full bg-neutralLighter px-4 text-text">
            {article.category}
          </p>
        )}
      </section>

      <RenderSections content={article} />
    </div>
  );
}

ArticleRoute.displayName = 'ArticleRoute';
