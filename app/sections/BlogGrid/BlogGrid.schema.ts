import {containerSettings} from '~/settings/container';

export function Schema({template}: {template: string}) {
  if (template !== 'blog') return null;

  return {
    category: 'Blog',
    label: 'Blog Grid',
    key: 'blog-grid',
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/blog-preview.jpg?v=1675732824',
    fields: [containerSettings()],
  };
}
