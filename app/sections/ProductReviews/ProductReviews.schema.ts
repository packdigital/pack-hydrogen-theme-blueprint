import {containerSettings} from '~/settings/container';

export const PRODUCT_REVIEWS_KEY = 'product-reviews';

export function Schema({template}: {template: string}) {
  if (template !== 'product') return null;

  return {
    category: 'Reviews',
    label: 'Product Reviews',
    key: PRODUCT_REVIEWS_KEY,
    fields: [containerSettings()],
  };
}
