import type {Page} from '~/lib/types';

const filterOutNoIndex = (page: Page) => !page.seo?.noIndex;

const CHANGE_FREQ = 'daily';
const PRIORITY = 0.7;

export const generatedSitemapFromPages = ({
  pages,
  siteUrl,
  route = 'static',
}: {
  pages: Page[];
  siteUrl: string;
  route: 'products' | 'collections' | 'pages' | 'blogs' | 'articles' | 'static';
}) => {
  const path = route === 'static' ? '' : `${route}/`;
  return `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
      ${pages
        .filter(filterOutNoIndex)
        .map(({handle}) => {
          return `
          <url>
            <loc>${siteUrl}/${path}${handle === '/' ? '' : handle}</loc>
            <changefreq>${CHANGE_FREQ}</changefreq>
            <priority>${PRIORITY}</priority>
          </url>
        `;
        })
        .join('')}
    </urlset>
  `;
};

export function truncate(str: string, num = 155): string {
  if (typeof str !== 'string') return '';
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num - 3) + '...';
}
