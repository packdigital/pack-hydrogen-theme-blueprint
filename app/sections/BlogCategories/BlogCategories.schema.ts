import {containerSettings} from '~/settings/container';

export function Schema({template}: {template: string}) {
  if (template !== 'blog') return null;

  return {
    category: 'Blog',
    label: 'Blog Categories',
    key: 'blog-categories',
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/blog-categories-preview.jpg?v=1675732821',
    fields: [
      {
        label: 'Categories',
        name: 'categories',
        component: 'list',
        description: '"All" category is added to the front automatically',
        field: {
          component: 'text',
        },
      },
      containerSettings(),
    ],
  };
}
