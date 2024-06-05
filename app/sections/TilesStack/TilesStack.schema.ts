import {
  COLORS,
  CONTENT_ALIGN,
  CROP_POSITIONS,
  HEADING_SIZES,
} from '~/settings/common';
import {containerSettings} from '~/settings/container';

export function Schema() {
  return {
    category: 'Media',
    label: 'Tiles Stack',
    key: 'tiles-stack',
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0629/5519/2520/files/tiles-stack-preview.webp?v=1717550766',
    fields: [
      {
        label: 'Header Settings',
        name: 'header',
        component: 'group',
        description: 'Heading, subheading, alignment',
        fields: [
          {
            label: 'Heading',
            name: 'heading',
            component: 'text',
            defaultValue: 'Tabbed Tiles Slider Heading',
          },
          {
            label: 'Subheading',
            name: 'subheading',
            component: 'text',
          },
          {
            label: 'Alignment',
            name: 'alignment',
            component: 'radio-group',
            direction: 'horizontal',
            variant: 'radio',
            options: CONTENT_ALIGN.mobile,
            defaultValue: 'text-center items-center',
          },
        ],
      },
      {
        label: 'Tiles',
        name: 'tiles',
        component: 'group-list',
        description:
          'On tablet and desktop, tiles will be displayed in one row; on mobile, tiles will stack',
        itemProps: {
          label: '{{item.heading}}',
        },
        fields: [
          {
            label: 'Image Alt',
            name: 'alt',
            component: 'text',
            description:
              'Alt text set in media manager for selected image(s) will take priority. Re-add image(s) if alt text was set in media manager after selection.',
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
        description:
          'Image apsect ratio, text color, tile text alignment, tile heading size, full width',
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
            label: 'Text Color',
            name: 'textColor',
            component: 'select',
            options: COLORS,
          },
          {
            label: 'Tile Text Alignment',
            name: 'textAlign',
            component: 'select',
            options: CONTENT_ALIGN.mobile,
          },
          {
            label: 'Tile Heading Size',
            name: 'tileHeadingSize',
            component: 'select',
            options: HEADING_SIZES,
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
          textColor: 'var(--text)',
          textAlign: 'text-left items-start',
          tileHeadingSize: 'text-h4',
          fullWidth: false,
        },
      },
      containerSettings(),
    ],
  };
}
