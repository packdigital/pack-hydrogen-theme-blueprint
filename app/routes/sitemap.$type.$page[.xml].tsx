import {getSitemap} from '@shopify/hydrogen';
import {XMLParser, XMLBuilder} from 'fast-xml-parser';
import type {AppLoadContext, LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {getSiteSettings} from '~/lib/utils';
import {CMS_ARTICLES_QUERY} from '~/data/graphql/pack/article-page';
import {CMS_BLOGS_QUERY} from '~/data/graphql/pack/blog-page';
import {CMS_COLLECTION_QUERY} from '~/data/graphql/pack/collection-page';
import {CMS_PAGES_QUERY} from '~/data/graphql/pack/page';
import {CMS_PRODUCT_QUERY} from '~/data/graphql/pack/product-page';
import type {Page} from '~/lib/types';

import {PACK_NATIVE_TEMPLATE_TYPES} from './[sitemap.xml]';

const STATIC_PAGES = (accountNoIndex: boolean) =>
  [
    {handle: 'account', seo: {noIndex: accountNoIndex}},
    {handle: 'account/login', seo: {noIndex: accountNoIndex}},
    {handle: 'account/register', seo: {noIndex: accountNoIndex}},
    {handle: 'cart', seo: {noIndex: false}},
    {handle: 'search', seo: {noIndex: false}},
  ] as Page[];

const EDGES: Record<string, string> = {
  products: 'productPage',
  collections: 'collectionPage',
  pages: 'pages',
  blogs: 'blogs',
  articles: 'articles',
};

const PACK_QUERIES: Record<string, string> = {
  products: CMS_PRODUCT_QUERY,
  collections: CMS_COLLECTION_QUERY,
  pages: CMS_PAGES_QUERY,
  blogs: CMS_BLOGS_QUERY,
  articles: CMS_ARTICLES_QUERY,
};

const getPagesFromType = async ({
  type,
  context,
}: {
  type: string;
  context: AppLoadContext;
}) => {
  const query = PACK_QUERIES[type];

  const getPages: any = async ({
    first,
    pages,
    cursor,
  }: {
    first: number;
    pages: any[] | null;
    cursor: string | null;
  }) => {
    const {data} = await context.pack.query(query, {
      variables: {first, cursor},
      cache: context.storefront.CacheLong(),
    });
    const {endCursor, hasNextPage} = data[EDGES[type]].pageInfo;
    const compiledPages = [...(pages || []), ...data[EDGES[type]].nodes];
    if (hasNextPage && compiledPages.length < 10000) {
      return getPages({
        first: Math.min(10000 - compiledPages.length, 100),
        pages: compiledPages,
        cursor: endCursor,
      });
    }
    return compiledPages;
  };

  return await getPages({
    first: 25,
    pages: null,
    cursor: null,
  });
};

export async function loader({request, params, context}: LoaderFunctionArgs) {
  const {type = '', page} = params;
  const {storefront} = context;

  const packQuery = PACK_QUERIES[type];
  const isPackNativeTemplateType = PACK_NATIVE_TEMPLATE_TYPES.includes(type);

  // If not valid sitemap type, return 404
  if (!packQuery) throw new Response(null, {status: 404});
  // If Pack native template type and not page 1, return 404
  if (isPackNativeTemplateType && page !== '1')
    throw new Response(null, {status: 404});

  const baseUrl = new URL(request.url).origin;

  /* ------------------------------------------------------------------------- */
  /* If Pack native template type, build sitemap from Pack query for that type */
  /* ------------------------------------------------------------------------- */
  if (isPackNativeTemplateType) {
    let pages = await getPagesFromType({type, context});

    // Add static pages to the pages sitemap
    if (type === 'pages') {
      const siteSettings = await getSiteSettings(context);
      const accountNoIndex =
        !!siteSettings?.data?.siteSettings?.settings?.account?.noIndex;
      pages = [...pages, ...STATIC_PAGES(accountNoIndex)];
    }

    const xmlToBuild = {
      urlset: {
        '@_xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
        '@_xmlns:xhtml': 'http://www.w3.org/1999/xhtml',
        url: pages.map((page: any) => ({
          loc: `${baseUrl}/${type}/${page.handle}`,
          changefreq: 'daily',
        })),
      },
    };
    const xmlBuilder = new XMLBuilder({ignoreAttributes: false});
    const sitemapXml = xmlBuilder.build(xmlToBuild);

    return new Response(sitemapXml, {
      headers: {
        'Content-Type': 'application/xml',
        'xml-version': '1.0',
        encoding: 'UTF-8',
        'Cache-Control': `max-age=${60 * 60 * 24}`,
      },
    });
  }

  /* ------------------------------------------------------------ */
  /* If Shopify template type, build initial sitemap from Shopify */
  /* ------------------------------------------------------------ */
  const response = await getSitemap({
    storefront,
    request,
    params,
    // The locales to include in the sitemap
    locales: ['EN-US'],
    // A function to generate a link for a given resource
    getLink: ({type, baseUrl, handle, locale}) => {
      if (!locale) return `${baseUrl}/${type}/${handle}`;
      return `${baseUrl}/${locale}/${type}/${handle}`;
    },
  });

  const shopifySitemapXml = await response.clone().text();
  const xmlParser = new XMLParser({ignoreAttributes: false});
  const xml = xmlParser.parse(shopifySitemapXml);

  const urls = Array.isArray(xml.urlset.url)
    ? [...xml.urlset.url]
    : [xml.urlset.url];

  // Filter out pages that should not be indexed via Pack customizer page settings
  const filteredSitemap = (
    await Promise.all(
      urls.map(async (url: any) => {
        const handle = url.loc.split('/').pop();
        const pageData = await context.pack.query(packQuery, {
          variables: {handle},
          cache: context.storefront.CacheLong(),
        });
        const page = pageData?.data?.[EDGES[type]];
        if (
          !page?.seo?.noIndex &&
          (type !== 'products' ||
            // If product, ensure product is active
            (type === 'products' &&
              page?.sourceProduct?.data?.status === 'ACTIVE'))
        ) {
          return {
            loc: url.loc,
            changefreq: 'weekly',
          };
        }
        return null;
      }),
    )
  ).filter(Boolean);

  const xmlToBuild = {
    urlset: {
      '@_xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
      '@_xmlns:xhtml': 'http://www.w3.org/1999/xhtml',
      url: filteredSitemap,
    },
  };

  const xmlBuilder = new XMLBuilder({ignoreAttributes: false});
  const sitemapXml = xmlBuilder.build(xmlToBuild);

  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml',
      'xml-version': '1.0',
      encoding: 'UTF-8',
      'Cache-Control': `max-age=${60 * 60 * 24}`,
    },
  });
}
