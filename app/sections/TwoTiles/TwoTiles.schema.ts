import {CROP_POSITIONS} from '~/settings/common';
import {containerSettings} from '~/settings/container';

export function Schema() {
  return {
    category: 'Media',
    label: 'Two Tiles',
    key: 'two-tiles',
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/two-tiles-preview.jpg?v=1675730356',
    fields: [
      {
        label: 'Tiles',
        name: 'tiles',
        description: 'Max of 2 tiles',
        component: 'group-list',
        itemProps: {
          label: '{{item.heading}}',
        },
        validate: {
          maxItems: 2,
        },
        fields: [
          {
            label: 'Image Alt',
            name: 'alt',
            component: 'text',
            description: 'Brief description of image',
          },
          {
            label: 'Image',
            name: 'image',
            component: 'image',
          },
          {
            label: 'Image Crop Position',
            name: 'crop',
            component: 'select',
            options: CROP_POSITIONS,
          },
          {
            label: 'Heading',
            name: 'heading',
            component: 'text',
          },
          {
            label: 'Description',
            name: 'description',
            component: 'textarea',
          },
          {
            label: 'Link',
            name: 'link',
            component: 'link',
          },
        ],
        defaultItem: {
          alt: 'Rack of green t-shirts',
          image: {
            src: 'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/keagan-henman-xPJYL0l5Ii8-unsplash_20_281_29.jpg?v=1672349016',
          },
          crop: 'center',
          heading: 'Headline',
          description: 'Nulla vitae elit libero, a pharetra augue.',
          link: {
            text: '',
            url: '',
          },
        },
        defaultValue: [
          {
            alt: 'Rack of green t-shirts',
            image: {
              src: 'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/keagan-henman-xPJYL0l5Ii8-unsplash_20_281_29.jpg?v=1672349016',
            },
            crop: 'center',
            heading: 'Headline',
            description: 'Nulla vitae elit libero, a pharetra augue.',
          },
          {
            alt: 'Dark orange jacket on a hanger',
            image: {
              src: 'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/tobias-tullius-Fg15LdqpWrs-unsplash.jpg?v=1672348152',
            },
            crop: 'center',
            heading: 'Headline',
            description: 'Nulla vitae elit libero, a pharetra augue.',
          },
        ],
      },
      {
        label: 'Section Settings',
        name: 'section',
        component: 'group',
        description: 'Image apsect ratio, full width',
        fields: [
          {
            label: 'Image Aspect Ratio',
            name: 'aspectRatio',
            component: 'select',
            options: [
              {label: '3:2', value: 'aspect-[3/2]'},
              {label: '4:3', value: 'aspect-[4/3]'},
              {label: '5:4', value: 'aspect-[5/4]'},
              {label: '8:7', value: 'aspect-[8/7]'},
              {label: '1:1', value: 'aspect-[1/1]'},
              {label: '7:8', value: 'aspect-[7/8]'},
              {label: '4:5', value: 'aspect-[4/5]'},
              {label: '3:4', value: 'aspect-[3/4]'},
              {label: '2:3', value: 'aspect-[2/3]'},
            ],
          },
          {
            label: 'Full Width',
            name: 'fullWidth',
            component: 'toggle',
            description: 'Removes max width of this section',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
        ],
        defaultValue: {
          aspectRatio: 'aspect-[5/4]',
          fullWidth: false,
        },
      },
      containerSettings(),
    ],
  };
}
