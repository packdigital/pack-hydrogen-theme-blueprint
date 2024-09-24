import {useMemo} from 'react';
import {useLoaderData} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import type {LoaderFunctionArgs, MetaArgs} from '@shopify/remix-oxygen';
import {AnalyticsPageType, getSeoMeta} from '@shopify/hydrogen';
import {RenderSections} from '@pack/react';

import {ARTICLE_QUERY} from '~/data/queries';
import {getShop, getSiteSettings} from '~/lib/utils';
import {routeHeaders} from '~/data/cache';
import {seoPayload} from '~/lib/seo.server';

export const headers = routeHeaders;

export async function loader({params, context, request}: LoaderFunctionArgs) {
  const {handle} = params;
  const {data} = await context.pack.query(ARTICLE_QUERY, {
    variables: {handle},
    cache: context.storefront.CacheLong(),
  });

  if (!data.article) throw new Response(null, {status: 404});

  const shop = await getShop(context);
  const siteSettings = await getSiteSettings(context);
  const analytics = {pageType: AnalyticsPageType.article};
  const seo = seoPayload.article({
    page: data.article,
    shop,
    siteSettings,
    url: request.url,
  });

  return json({
    analytics,
    article: data.article,
    seo,
    url: request.url,
  });
}

export const meta = ({data}: MetaArgs) => {
  return getSeoMeta(data.seo);
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
      </section>

      <RenderSections content={article} />
    </div>
  );
}

ArticleRoute.displayName = 'ArticleRoute';