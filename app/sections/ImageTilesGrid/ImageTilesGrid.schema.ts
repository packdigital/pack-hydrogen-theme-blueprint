import {
  BUTTONS,
  COLORS,
  CONTENT_ALIGN,
  CROP_POSITIONS,
  FLEX_POSITIONS,
  HEADING_SIZES,
} from '~/settings/common';
import {containerSettings} from '~/settings/container';

const DEFAULT_IMAGE_ROW = [
  {
    alt: 'Man in white and light tan outfit',
    image: {
      src: 'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/man-in-white-and-light-tan-outfit.jpg?v=1672348139',
    },
    crop: 'center',
    heading: 'Headline',
    buttons: [
      {
        link: {
          text: 'Shop Now',
          url: '',
        },
      },
    ],
  },
  {
    alt: 'Man in brown coat sitting down',
    image: {
      src: 'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/austin-wade-d2s8NQ6WD24-unsplash.jpg?v=1672348122',
    },
    crop: 'center',
    heading: 'Headline',
    buttons: [
      {
        link: {
          text: 'Shop Now',
          url: '',
        },
      },
    ],
  },
  {
    alt: 'Man in gray sweater and tan coat',
    image: {
      src: 'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/man-poses-in-light-colored-overcoat.jpg?v=1672348143',
    },
    crop: 'center',
    heading: 'Headline',
    buttons: [
      {
        link: {
          text: 'Shop Now',
          url: '',
        },
      },
    ],
  },
];

export function Schema() {
  return {
    category: 'Media',
    label: 'Image Tiles Grid',
    key: 'image-tiles-grid',
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0629/5519/2520/files/image-tiles-grid-preview.jpg?v=1707439989',
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
            label: 'Buttons',
            name: 'buttons',
            component: 'group-list',
            description:
              'Max of 2 buttons. Second button will be hidden if image is set to be clickable',
            itemProps: {
              label: '{{item.link.text}}',
            },
            defaultItem: {
              link: {
                text: 'Shop Now',
                url: '',
              },
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
            ],
          },
        ],
        defaultItem: {
          alt: 'Man in white and light tan outfit',
          image: {
            src: 'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/man-in-white-and-light-tan-outfit.jpg?v=1672348139',
          },
          crop: 'center',
          heading: 'Headline',
          buttons: [
            {
              link: {
                text: 'Shop Now',
                url: '',
              },
            },
          ],
        },
        defaultValue: [...DEFAULT_IMAGE_ROW, ...DEFAULT_IMAGE_ROW],
      },
      {
        label: 'Content Settings',
        name: 'content',
        component: 'group',
        description:
          'Dark overlay, content position, content alignment, tile heading size, button styles, clickable image, hide buttons',
        fields: [
          {
            label: 'Dark Overlay',
            name: 'darkOverlay',
            component: 'toggle',
            description: 'Adds 20% opacity black overlay over media',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
          {
            label: 'Content Position',
            name: 'contentPosition',
            component: 'select',
            options: FLEX_POSITIONS.mobile,
          },
          {
            label: 'Content Alignment',
            name: 'contentAlign',
            component: 'select',
            options: [
              {label: 'Left', value: 'left'},
              {label: 'Center', value: 'center'},
              {label: 'Right', value: 'right'},
            ],
          },
          {
            label: 'Tile Heading Size',
            name: 'tileHeadingSize',
            component: 'select',
            options: HEADING_SIZES,
          },
          {
            label: 'Primary Button Style',
            name: 'primaryButtonStyle',
            component: 'select',
            options: BUTTONS,
          },
          {
            label: 'Secondary Button Style',
            name: 'secondaryButtonStyle',
            component: 'select',
            options: BUTTONS,
          },
          {
            label: 'Clickable Image',
            name: 'clickableImage',
            component: 'toggle',
            description: `Makes entire image clickable using primary button's link; hides any secondary button`,
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
          {
            label: 'Hide Buttons',
            name: 'hideButtons',
            component: 'toggle',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
        ],
        defaultValue: {
          darkOverlay: true,
          contentPosition: 'justify-center items-end',
          contentAlign: 'center',
          tileHeadingSize: 'text-h3',
          primaryButtonStyle: 'btn-inverse-light',
          secondaryButtonStyle: 'btn-inverse-light',
          clickableImage: true,
          hideButtons: false,
        },
      },
      {
        label: 'Section Settings',
        name: 'section',
        component: 'group',
        description:
          'Image aspect ratio, grid settings per viewport, heading text color, full width',
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
            label: 'Desktop Settings',
            name: 'desktop',
            component: 'group',
            description: 'Grid columns, spacing for desktop',
            fields: [
              {
                label: 'Grid Columns',
                name: 'gridCols',
                component: 'select',
                options: [
                  {label: '1', value: 'lg:grid-cols-1'},
                  {label: '2', value: 'lg:grid-cols-2'},
                  {label: '3', value: 'lg:grid-cols-3'},
                  {label: '4', value: 'lg:grid-cols-4'},
                  {label: '5', value: 'lg:grid-cols-5'},
                  {label: '6', value: 'lg:grid-cols-6'},
                ],
              },
              {
                label: 'Grid Spacing',
                name: 'gap',
                component: 'select',
                options: [
                  {label: '0px', value: 'lg:gap-0'},
                  {label: '2px', value: 'lg:gap-0.5'},
                  {label: '4px', value: 'lg:gap-1'},
                  {label: '6px', value: 'lg:gap-1.5'},
                  {label: '8px', value: 'lg:gap-2'},
                  {label: '10px', value: 'lg:gap-2.5'},
                  {label: '12px', value: 'lg:gap-3'},
                  {label: '14px', value: 'lg:gap-3.5'},
                  {label: '16px', value: 'lg:gap-4'},
                  {label: '20px', value: 'lg:gap-5'},
                  {label: '24px', value: 'lg:gap-6'},
                  {label: '28px', value: 'lg:gap-7'},
                  {label: '32px', value: 'lg:gap-8'},
                  {label: '36px', value: 'lg:gap-9'},
                  {label: '40px', value: 'lg:gap-10'},
                  {label: '44px', value: 'lg:gap-11'},
                  {label: '48px', value: 'lg:gap-12'},
                ],
              },
              {
                label: 'Full Bleed',
                name: 'fullBleed',
                component: 'toggle',
                description: 'Removes horizontal padding',
                toggleLabels: {
                  true: 'On',
                  false: 'Off',
                },
              },
            ],
            defaultValue: {
              gridCols: 'lg:grid-cols-3',
              gap: 'lg:gap-2',
              fullBleed: false,
            },
          },
          {
            label: 'Tablet Settings',
            name: 'tablet',
            component: 'group',
            description: 'Grid columns, spacing for tablet',
            fields: [
              {
                label: 'Grid Columns',
                name: 'gridCols',
                component: 'select',
                options: [
                  {label: '1', value: 'max-lg:grid-cols-1'},
                  {label: '2', value: 'max-lg:grid-cols-2'},
                  {label: '3', value: 'max-lg:grid-cols-3'},
                  {label: '4', value: 'max-lg:grid-cols-4'},
                  {label: '5', value: 'max-lg:grid-cols-5'},
                  {label: '6', value: 'max-lg:grid-cols-6'},
                ],
              },
              {
                label: 'Grid Spacing',
                name: 'gap',
                component: 'select',
                options: [
                  {label: '0px', value: 'max-lg:gap-0'},
                  {label: '2px', value: 'max-lg:gap-0.5'},
                  {label: '4px', value: 'max-lg:gap-1'},
                  {label: '6px', value: 'max-lg:gap-1.5'},
                  {label: '8px', value: 'max-lg:gap-2'},
                  {label: '10px', value: 'max-lg:gap-2.5'},
                  {label: '12px', value: 'max-lg:gap-3'},
                  {label: '14px', value: 'max-lg:gap-3.5'},
                  {label: '16px', value: 'max-lg:gap-4'},
                  {label: '20px', value: 'max-lg:gap-5'},
                  {label: '24px', value: 'max-lg:gap-6'},
                  {label: '28px', value: 'max-lg:gap-7'},
                  {label: '32px', value: 'max-lg:gap-8'},
                  {label: '36px', value: 'max-lg:gap-9'},
                  {label: '40px', value: 'max-lg:gap-10'},
                ],
              },
              {
                label: 'Full Bleed',
                name: 'fullBleed',
                component: 'toggle',
                description: 'Removes horizontal padding',
                toggleLabels: {
                  true: 'On',
                  false: 'Off',
                },
              },
            ],
            defaultValue: {
              gridCols: 'max-lg:grid-cols-2',
              gap: 'max-lg:gap-2',
              fullBleed: false,
            },
          },
          {
            label: 'Mobile Settings',
            name: 'mobile',
            component: 'group',
            description: 'Grid columns, spacing for mobile',
            fields: [
              {
                label: 'Grid Columns',
                name: 'gridCols',
                component: 'select',
                options: [
                  {label: '1', value: 'max-md:grid-cols-1'},
                  {label: '2', value: 'max-md:grid-cols-2'},
                  {label: '3', value: 'max-md:grid-cols-3'},
                ],
              },
              {
                label: 'Grid Spacing',
                name: 'gap',
                component: 'select',
                options: [
                  {label: '0px', value: 'max-md:gap-0'},
                  {label: '2px', value: 'max-md:gap-0.5'},
                  {label: '4px', value: 'max-md:gap-1'},
                  {label: '6px', value: 'max-md:gap-1.5'},
                  {label: '8px', value: 'max-md:gap-2'},
                  {label: '10px', value: 'max-md:gap-2.5'},
                  {label: '12px', value: 'max-md:gap-3'},
                  {label: '14px', value: 'max-md:gap-3.5'},
                  {label: '16px', value: 'max-md:gap-4'},
                  {label: '20px', value: 'max-md:gap-5'},
                  {label: '24px', value: 'max-md:gap-6'},
                  {label: '28px', value: 'max-md:gap-7'},
                  {label: '32px', value: 'max-md:gap-8'},
                ],
              },
              {
                label: 'Full Bleed',
                name: 'fullBleed',
                component: 'toggle',
                description: 'Removes horizontal padding',
                toggleLabels: {
                  true: 'On',
                  false: 'Off',
                },
              },
            ],
            defaultValue: {
              gridCols: 'max-md:grid-cols-1',
              gap: 'max-md:gap-2',
              fullBleed: false,
            },
          },
          {
            label: 'Heading Text Color',
            name: 'textColor',
            component: 'select',
            options: COLORS,
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
          aspectRatio: 'aspect-[1/1]',
          textColor: 'var(--text)',
          fullWidth: false,
        },
      },
      containerSettings(),
    ],
  };
}
