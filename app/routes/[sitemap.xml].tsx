import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

const SITEMAP_FILENAMES = [
  'sitemap_static.xml',
  'sitemap_pages.xml',
  'sitemap_blogs.xml',
  'sitemap_articles.xml',
  'sitemap_products.xml',
  'sitemap_collections.xml',
];

const generatedSitemapIndex = (filenames: string[], siteUrl: string) => {
  return `
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${filenames
        .map((filename) => {
          return `
            <sitemap>
              <loc>${siteUrl}/${filename}</loc>
            </sitemap>
          `;
        })
        .join('')}
    </sitemapindex>
  `;
};

export async function loader({context}: LoaderFunctionArgs) {
  const SITE_DOMAIN = context.storefront.getShopifyDomain();
  const sitemapIndex = generatedSitemapIndex(SITEMAP_FILENAMES, SITE_DOMAIN);

  return new Response(sitemapIndex, {
    headers: {
      'Content-Type': 'application/xml',
      'xml-version': '1.0',
      encoding: 'UTF-8',
    },
  });
}
