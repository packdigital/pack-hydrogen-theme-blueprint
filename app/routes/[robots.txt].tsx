import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {getPrimaryDomain} from '~/lib/utils';

export const loader = ({context, request}: LoaderFunctionArgs) => {
  const PRIMARY_DOMAIN = getPrimaryDomain({context, request});

  return new Response(robotsTxtData({url: PRIMARY_DOMAIN}), {
    status: 200,
    headers: {
      'content-type': 'text/plain',
      // Cache for 24 hours
      'cache-control': `max-age=${60 * 60 * 24}`,
    },
  });
};

function robotsTxtData({url}: {url: string}) {
  const sitemapUrl = url ? `${url}/sitemap.xml` : undefined;

  return `
    User-agent: *
    Disallow: /admin
    Disallow: /cart
    Disallow: /orders
    Disallow: /checkouts/
    Disallow: /checkout
    Disallow: /carts
    Disallow: /account
    ${sitemapUrl ? `Sitemap: ${sitemapUrl}` : ''}

    # Google adsbot ignores robots.txt unless specifically named!
    User-agent: adsbot-google
    Disallow: /checkouts/
    Disallow: /checkout
    Disallow: /carts
    Disallow: /orders

    User-agent: Pinterest
    Crawl-delay: 1
  `.trim();
}
