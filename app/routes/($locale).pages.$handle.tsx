import {useLoaderData} from '@remix-run/react';
import {
  AnalyticsPageType,
  getSeoMeta,
  storefrontRedirect,
} from '@shopify/hydrogen';
import {RenderSections} from '@pack/react';
import type {LoaderFunctionArgs, MetaArgs} from '@shopify/remix-oxygen';

import {getPage} from '~/lib/server-utils/pack.server';
import {getShop, getSiteSettings} from '~/lib/server-utils/settings.server';
import {seoPayload} from '~/lib/server-utils/seo.server';
import {getProductsMapForPage} from '~/lib/server-utils/product.server';
import {PAGE_QUERY} from '~/data/graphql/pack/page';
import {routeHeaders} from '~/data/cache';
import type {Page} from '~/lib/types';

export const headers = routeHeaders;

export async function loader({context, params, request}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) throw new Response(null, {status: 404});

  const [{page}, shop, siteSettings] = await Promise.all([
    getPage({context, handle, pageKey: 'page', query: PAGE_QUERY}),
    getShop(context),
    getSiteSettings(context),
  ]);

  if (!page) {
    const redirect = await storefrontRedirect({request, storefront});
    if (redirect.status === 301) return redirect;
    throw new Response(null, {status: 404});
  }

  /* Certain product sections require fetching products before page load */
  const productsMap = await getProductsMapForPage({
    context,
    page,
  });

  const isPolicy = handle?.includes('privacy') || handle?.includes('policy');
  const analytics = {
    pageType: isPolicy ? AnalyticsPageType.policy : AnalyticsPageType.page,
  };
  const seo = seoPayload.page({
    page,
    shop,
    siteSettings,
  });

  return {
    analytics,
    page,
    productsMap,
    seo,
    url: request.url,
  };
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function PageRoute() {
  const {page} = useLoaderData<{page: Page}>();

  return (
    <div data-comp={PageRoute.displayName}>
      <RenderSections content={page} />
    </div>
  );
}

PageRoute.displayName = 'PageRoute';
