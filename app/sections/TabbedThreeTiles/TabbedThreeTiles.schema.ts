import {COLORS, CROP_POSITIONS} from '~/settings/common';
import {containerSettings} from '~/settings/container';

const defaultTab = {
  tabName: 'Tab Name',
  tiles: [
    {
      alt: 'Man in white and light tan outfit',
      image: {
        src: 'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/man-in-white-and-light-tan-outfit.jpg?v=1672348139',
      },
      crop: 'center',
      heading: 'Headline',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    },
    {
      alt: 'Man in brown coat sitting down',
      image: {
        src: 'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/austin-wade-d2s8NQ6WD24-unsplash.jpg?v=1672348122',
      },
      crop: 'center',
      heading: 'Headline',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    },
    {
      alt: 'Man in gray sweater and tan coat',
      image: {
        src: 'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/man-poses-in-light-colored-overcoat.jpg?v=1672348143',
      },
      crop: 'center',
      heading: 'Headline',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    },
  ],
};

export function Schema() {
  return {
    category: 'Media',
    label: 'Tabbed Three Tiles',
    key: 'tabbed-three-tiles',
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/tabbed-three-tiles-preview.jpg?v=1675730342',
    fields: [
      {
        label: 'Heading',
        name: 'heading',
        component: 'text',
        defaultValue: 'Tabbed Three Tile Heading',
      },
      {
        label: 'Tabs',
        name: 'tabs',
        component: 'group-list',
        itemProps: {
          label: '{{item.tabName}}',
        },
        fields: [
          {
            label: 'Tab Name',
            name: 'tabName',
            component: 'text',
          },
          {
            label: 'Tiles',
            name: 'tiles',
            description: 'Max of 3 tiles',
            component: 'group-list',
            itemProps: {
              label: '{{item.heading}}',
            },
            validate: {
              maxItems: 3,
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
              alt: 'Man in white and light tan outfit',
              image: {
                src: 'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/man-in-white-and-light-tan-outfit.jpg?v=1672348139',
              },
              crop: 'center',
              heading: 'Headline',
              description:
                'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
              link: {
                text: '',
                url: '',
              },
            },
          },
        ],
        defaultValue: [defaultTab],
        defaultItem: defaultTab,
      },
      {
        label: 'Footer Button',
        name: 'button',
        component: 'link',
      },
      {
        label: 'Section Settings',
        name: 'section',
        component: 'group',
        description:
          'Image aspect ratio, background color, text color, full width',
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
            label: 'Background Color',
            name: 'bgColor',
            component: 'select',
            options: COLORS,
          },
          {
            label: 'Text Color',
            name: 'textColor',
            component: 'select',
            options: COLORS,
          },
          {
            label: 'Button Style',
            name: 'buttonStyle',
            component: 'select',
            options: [
              {label: 'Primary', value: 'btn-primary'},
              {label: 'Secondary', value: 'btn-secondary'},
              {label: 'Inverse Light', value: 'btn-inverse-light'},
              {label: 'Inverse Dark', value: 'btn-inverse-dark'},
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
          aspectRatio: 'aspect-[3/4]',
          bgColor: 'var(--background)',
          textColor: 'var(--text)',
          buttonStyle: 'btn-primary',
          fullWidth: false,
        },
      },
      containerSettings(),
    ],
  };
}
