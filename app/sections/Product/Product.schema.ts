import {containerSettings} from '~/settings/container';

export const PRODUCT_SECTION_KEY = 'product';

export function Schema({template}: {template: string}) {
  if (template !== 'page') return null;

  return {
    category: 'Product',
    label: 'Product',
    key: PRODUCT_SECTION_KEY,
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0822/0439/3780/files/product-preview.jpg?v=1721419443',
    fields: [
      {
        name: 'product',
        component: 'productSearch',
        label: 'Product',
        description:
          'The product must be both active and on the Hydrogen sales channel to display',
      },
      containerSettings(),
    ],
  };
}
