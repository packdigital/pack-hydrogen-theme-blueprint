import {BUTTONS} from '~/settings/common';
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
        itemProps: {
          label: '{{item.title}}',
        },
        fields: [
          {
            label: 'Image Location',
            name: 'imageLocation',
            component: 'select',
            options: [
              {label: 'Left', value: 'left'},
              {label: 'Right', value: 'right'},
            ],
            validate: {
              required: true,
            },
          },
          {
            label: 'Image Desktop',
            name: 'imageDesktop',
            component: 'image',
            description: 'Image for the slide',
            validate: {
              required: true,
            },
          },
          {
            label: 'Image Alt Text',
            name: 'imageAltText',
            component: 'text',
            description: ' title for the slide',
            validate: {
              required: true,
            },
          },
          {
            label: 'Title',
            name: 'title',
            component: 'text',
            description: 'Optional title for the slide',
            validate: {
              required: true,
            },
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
          {
            label: 'Description',
            name: 'description',
            component: 'html',
            description: 'Optional html for the slide',
            validate: {
              required: true,
            },
          },

          {
            label: 'Feature Orientation',
            name: 'featureOrientation',
            component: 'select',
            options: [
              {label: 'Vertical', value: 'vertical'},
              {label: 'Horizontal', value: 'horizontal'},
            ],
          },

          {
            label: 'Features List',
            name: 'features',
            component: 'list',
            field: {
              component: 'text',
            },
          },

          {
            label: 'Buttons',
            name: 'buttons',
            component: 'group-list',
            description: 'Max of two buttons',
            itemProps: {
              label: '{{item.link.text}}',
            },
            validate: {
              maxItems: 2,
            },
            fields: [
              {
                label: 'Link',
                name: 'link',
                component: 'link',
              },
              {
                label: 'Button Style',
                name: 'style',
                component: 'select',
                options: BUTTONS,
              },
            ],
            defaultItem: {
              link: {text: 'Shop Now', url: ''},
              style: 'btn-primary',
            },
          },
        ],
      },
      containerSettings(),
    ],
  };
}
