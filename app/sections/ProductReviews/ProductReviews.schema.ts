import {containerSettings} from '~/settings/container';

export function Schema({template}: {template: string}) {
  if (template !== 'product') return null;

  return {
    category: 'Reviews',
    label: 'Product Reviews',
    key: 'product-reviews',
    fields: [containerSettings()],
  };
}
