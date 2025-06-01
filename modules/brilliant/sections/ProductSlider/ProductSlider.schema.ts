import {containerSettings} from '~/settings/container';

export function Schema() {
  return {
    category: 'Page',
    label: 'Brilliant - Product Slider',
    key: 'brilliant-product-slider',
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0739/0258/8119/files/product_slider_screenshot.png?v=1746486287',
    fields: [
      {
        label: 'Heading',
        name: 'heading',
        component: 'text',
        defaultValue: 'Product Slider Heading',
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
        ],
      },
      {
        label: 'Slides',
        name: 'slides',
        component: 'group-list',
        description: 'Add slides to the product slider',
        fields: [
          {
            label: 'Design',
            name: 'design',
            component: 'select',
            options: [
              {label: 'Default', value: 'default'},
              {label: 'Full Background', value: 'fullBackground'},
            ],
          },
          {
            label: 'Title',
            name: 'title',
            component: 'text',
            description: 'Optional title for the slide',
          },
          {
            label: 'Title 2',
            name: 'title2',
            component: 'text',
            description: 'Optional second title for the slide',
          },
          {
            label: 'Tagline',
            name: 'tagline',
            component: 'text',
            description: 'Optional tagline for the slide',
          },
        ],
      },
      containerSettings(),
    ],
  };
}
