import {CROP_POSITIONS} from '~/settings/common';
import {containerSettings} from '~/settings/container';

const ASPECT_RATIOS = [
  {label: 'Native Aspect Ratio', value: 'native'},
  {label: '5:1', value: '5/1'},
  {label: '4:1', value: '4/1'},
  {label: '3:1', value: '3/1'},
  {label: '5:2', value: '5/2'},
  {label: '2:1', value: '2/1'},
  {label: '16:9', value: '16/9'},
  {label: '3:2', value: '3/2'},
  {label: '4:3', value: '4/3'},
  {label: '5:4', value: '5/4'},
  {label: '1:1', value: '1/1'},
  {label: '4:5', value: '4/5'},
  {label: '3:4', value: '3/4'},
  {label: '2:3', value: '2/3'},
  {label: '9:16', value: '9/16'},
];

export function Schema() {
  return {
    category: 'Media',
    label: 'Image',
    key: 'image',
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/image-preview.jpg?v=1675730321',
    fields: [
      {
        label: 'Image Settings',
        name: 'image',
        component: 'group',
        description: 'Image, aspect ratio, image position',
        fields: [
          {
            label: 'Image Alt',
            name: 'alt',
            component: 'text',
            description:
              'Alt text set in media manager for selected image(s) will take priority. Re-add image(s) if alt text was set in media manager after selection.',
          },
          {
            label: 'Image (tablet/desktop)',
            name: 'imageDesktop',
            component: 'image',
          },
          {
            label: 'Image Aspect Ratio (tablet/desktop)',
            name: 'aspectDesktop',
            component: 'select',
            options: ASPECT_RATIOS,
          },
          {
            label: 'Image Crop Position (tablet/desktop)',
            name: 'cropDesktop',
            component: 'select',
            options: CROP_POSITIONS,
          },
          {
            label: 'Image (mobile)',
            name: 'imageMobile',
            component: 'image',
          },
          {
            label: 'Image Aspect Ratio (mobile)',
            name: 'aspectMobile',
            component: 'select',
            options: ASPECT_RATIOS,
          },
          {
            label: 'Image Crop Position (mobile)',
            name: 'cropMobile',
            component: 'select',
            options: CROP_POSITIONS,
          },
        ],
        defaultValue: {
          alt: 'Rack of green t-shirts',
          imageDesktop: {
            src: 'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/keagan-henman-xPJYL0l5Ii8-unsplash_20_281_29.jpg?v=1672349016',
          },
          aspectDesktop: 'native',
          cropDesktop: 'center',
          imageMobile: {
            src: 'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/keagan-henman-xPJYL0l5Ii8-unsplash_20_281_29.jpg?v=1672349016',
          },
          aspectMobile: 'native',
          positionMobile: 'object-center',
        },
      },
      {
        label: 'Content Settings',
        name: 'content',
        component: 'group',
        description: 'Link, caption',
        fields: [
          {
            label: 'Link',
            name: 'link',
            component: 'link',
            description: 'Optional link to make image clickable',
          },
          {
            label: 'Caption',
            name: 'caption',
            component: 'markdown',
            description: 'Optional caption below image',
          },
        ],
      },
      {
        label: 'Section Settings',
        name: 'section',
        component: 'group',
        description: 'Max width, horizontal padding',
        fields: [
          {
            label: 'Max Width',
            name: 'maxWidth',
            component: 'select',
            options: [
              {
                label: 'Narrow',
                value: 'max-w-[30rem]',
              },
              {
                label: 'Medium Narrow',
                value: 'max-w-[45rem]',
              },
              {
                label: 'Medium',
                value: 'max-w-[60rem]',
              },
              {
                label: 'Medium Wide',
                value: 'max-w-[75rem]',
              },
              {
                label: 'Wide',
                value: 'max-w-[90rem]',
              },
              {label: 'Full', value: 'max-w-full'},
            ],
          },
          {
            label: 'Enable Horizontal Padding',
            name: 'enablePadding',
            component: 'toggle',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
        ],
        defaultValue: {
          maxWidth: 'max-w-[90rem]',
          enablePadding: true,
        },
      },
      containerSettings(),
    ],
  };
}
