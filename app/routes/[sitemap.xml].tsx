import {getSitemapIndex} from '@shopify/hydrogen';
import {XMLParser, XMLBuilder} from 'fast-xml-parser';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

type SitemapTypes = Parameters<typeof getSitemapIndex>[0]['types'];

export const SHOPIFY_TEMPLATE_TYPES = ['products', 'collections'];
export const PACK_NATIVE_TEMPLATE_TYPES = ['pages', 'blogs', 'articles'];

export async function loader({
  request,
  context: {storefront},
}: LoaderFunctionArgs) {
  const response = await getSitemapIndex({
    storefront,
    request,
    types: SHOPIFY_TEMPLATE_TYPES as SitemapTypes,
  });

  const shopifySitemapIndexXml = await response.clone().text();
  const xmlParser = new XMLParser({ignoreAttributes: false});
  const xml = xmlParser.parse(shopifySitemapIndexXml);

  const baseUrl = new URL(request.url).origin;
  const sitemaps = Array.isArray(xml.sitemapindex.sitemap)
    ? [...xml.sitemapindex.sitemap]
    : [xml.sitemapindex.sitemap];

  PACK_NATIVE_TEMPLATE_TYPES.forEach((type) => {
    sitemaps.push({
      loc: `${baseUrl}/sitemap/${type}/1.xml`,
    });
  });

  xml.sitemapindex.sitemap = sitemaps;

  const xmlBuilder = new XMLBuilder({ignoreAttributes: false});
  const sitemapIndexXml = xmlBuilder.build({sitemapindex: xml.sitemapindex});

  return new Response(sitemapIndexXml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': `max-age=${60 * 60 * 24}`,
      'xml-version': '1.0',
      encoding: 'UTF-8',
    },
  });
}
