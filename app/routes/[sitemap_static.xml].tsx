import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {
  generatedSitemapFromPages,
  getPrimaryDomain,
  getSiteSettings,
} from '~/lib/utils';
import type {Page} from '~/lib/types';

const STATIC_PAGES = (accountNoIndex: boolean) =>
  [
    {handle: '/', seo: {noIndex: false}},
    {handle: 'account', seo: {noIndex: accountNoIndex}},
    {handle: 'account/login', seo: {noIndex: accountNoIndex}},
    {handle: 'account/register', seo: {noIndex: accountNoIndex}},
    {handle: 'cart', seo: {noIndex: false}},
    {handle: 'search', seo: {noIndex: false}},
  ] as Page[];

export async function loader({context, request}: LoaderFunctionArgs) {
  const PRIMARY_DOMAIN = getPrimaryDomain({context, request});
  const siteSettings = await getSiteSettings(context);
  const accountNoIndex =
    !!siteSettings?.data?.siteSettings?.settings?.account?.noIndex;

  const sitemap = generatedSitemapFromPages({
    pages: STATIC_PAGES(accountNoIndex),
    siteUrl: PRIMARY_DOMAIN,
    route: 'static',
  });

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'xml-version': '1.0',
      encoding: 'UTF-8',
    },
  });
}
