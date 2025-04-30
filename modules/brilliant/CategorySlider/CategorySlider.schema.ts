import {containerSettings} from '~/settings/container';

export function Schema() {
  return {
    category: 'Product',
    label: 'Brilliant - Category Slider',
    key: 'category-slider',
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0739/0258/8119/files/Featured_Slider.png?v=1745731484',
    fields: [
      {
        label: 'Heading',
        name: 'heading',
        component: 'text',
        defaultValue: 'Products Slider Heading',
      },
      {
        label: 'Categorys',
        name: 'categorys',
        component: 'group-list',
        itemProps: {
          label: '{{item.collection.title}}',
        },
        fields: [
          {
            label: 'Collection',
            name: 'collection',
            component: 'collections',
          },
        ],
      },
      {
        label: 'Section Settings',
        name: 'section',
        component: 'group',
        description: 'Full width',
        fields: [
          {
            label: 'Full Width',
            name: 'fullWidth',
            component: 'toggle',
            description: 'Removes max width from contained styles',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
          {
            label: 'Margin',
            name: 'margin',
            component: 'number',
            defaultValue: 0,
          },
        ],
      },
      containerSettings(),
    ],
  };
}
