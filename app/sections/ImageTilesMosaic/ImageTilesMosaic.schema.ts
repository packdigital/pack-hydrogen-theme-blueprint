import {
  BUTTONS,
  COLORS,
  CONTENT_ALIGN,
  FLEX_POSITIONS,
  HEADING_SIZES,
  OBJECT_POSITIONS,
} from '~/settings/common';
import {containerSettings} from '~/settings/container';

const ASPECT_RATIOS_MOBILE = [
  {label: '3:2', value: 'max-md:aspect-[3/2]'},
  {label: '4:3', value: 'max-md:aspect-[4/3]'},
  {label: '5:4', value: 'max-md:aspect-[5/4]'},
  {label: '8:7', value: 'max-md:aspect-[8/7]'},
  {label: '1:1', value: 'max-md:aspect-[1/1]'},
  {label: '7:8', value: 'max-md:aspect-[7/8]'},
  {label: '4:5', value: 'max-md:aspect-[4/5]'},
  {label: '3:4', value: 'max-md:aspect-[3/4]'},
  {label: '2:3', value: 'max-md:aspect-[2/3]'},
];

const ASPECT_RATIOS_DESKTOP = [
  {label: '3:2', value: 'md:aspect-[3/2]'},
  {label: '4:3', value: 'md:aspect-[4/3]'},
  {label: '5:4', value: 'md:aspect-[5/4]'},
  {label: '8:7', value: 'md:aspect-[8/7]'},
  {label: '1:1', value: 'md:aspect-[1/1]'},
  {label: '7:8', value: 'md:aspect-[7/8]'},
  {label: '4:5', value: 'md:aspect-[4/5]'},
  {label: '3:4', value: 'md:aspect-[3/4]'},
  {label: '2:3', value: 'md:aspect-[2/3]'},
];

const DEFAULT_PRIMARY_TILE = {
  aspectRatioDesktop: 'md:aspect-[1/1]',
  aspectRatioMobile: 'max-md:aspect-[4/3]',
  alt: 'Man in white and light tan outfit',
  image: {
    src: 'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/man-in-white-and-light-tan-outfit.jpg?v=1672348139',
  },
  positionDesktop: 'md:object-center',
  positionMobile: 'object-center',
  heading: 'Headline',
  buttons: [
    {
      link: {
        text: 'Shop Now',
        url: '',
      },
      style: 'btn-inverse-light',
    },
  ],
};

const DEFAULT_SECONDARY_TILES = [
  {
    aspectRatioMobile: 'max-md:aspect-[4/3]',
    alt: 'Man crossing the street',
    image: {
      src: 'https://cdn.shopify.com/s/files/1/0629/5519/2520/files/man-crossing-street.jpg?v=1700370669',
    },
    positionDesktop: 'md:object-center',
    positionMobile: 'object-center',
    heading: 'Headline',
    buttons: [
      {
        link: {
          text: 'Shop Now',
          url: '',
        },
        style: 'btn-inverse-light',
      },
    ],
  },
  {
    aspectRatioMobile: 'max-md:aspect-[4/3]',
    alt: 'Man with beanie and his feet propped up',
    image: {
      src: 'https://cdn.shopify.com/s/files/1/0629/5519/2520/files/man-with-shoes-up-front.jpg?v=1700370673',
    },
    positionDesktop: 'md:object-center',
    positionMobile: 'object-center',
    heading: 'Headline',
    buttons: [
      {
        link: {
          text: 'Shop Now',
          url: '',
        },
        style: 'btn-inverse-light',
      },
    ],
  },
  {
    aspectRatioMobile: 'max-md:aspect-[4/3]',
    alt: 'Man in gray sweater and tan coat',
    image: {
      src: 'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/man-poses-in-light-colored-overcoat.jpg?v=1672348143',
    },
    positionDesktop: 'md:object-center',
    positionMobile: 'object-center',
    heading: 'Headline',
    buttons: [
      {
        link: {
          text: 'Shop Now',
          url: '',
        },
        style: 'btn-inverse-light',
      },
    ],
  },
];

const tileFields = [
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
    label: 'Image Position (tablet/desktop)',
    name: 'positionDesktop',
    component: 'select',
    options: OBJECT_POSITIONS.desktop,
  },
  {
    label: 'Image Position (mobile)',
    name: 'positionMobile',
    component: 'select',
    options: OBJECT_POSITIONS.mobile,
  },
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
    label: 'Buttons',
    name: 'buttons',
    component: 'group-list',
    description: `If clickable images is enabled, the first button's link will be used, and the second button will be hidden.`,
    itemProps: {
      label: '{{item.link.text}}',
    },
    defaultItem: {
      link: {
        text: 'Shop Now',
        url: '',
      },
      style: 'btn-inverse-light',
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
  },
  {
    label: 'Hide Button',
    name: 'hideButton',
    component: 'toggle',
    description:
      'If clickable images is enabled and do not want the button to show',
    toggleLabels: {
      true: 'On',
      false: 'Off',
    },
  },
];

export function Schema() {
  return {
    category: 'Media',
    label: 'Image Tiles Mosaic',
    key: 'image-tiles-mosaic',
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0629/5519/2520/files/image-tiles-mosaic-preview.jpg?v=1714954409',
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
        label: 'Primary Tile',
        name: 'primary',
        component: 'group',
        description: 'Placement, aspect ratios, tile content',
        fields: [
          {
            label: 'Placement (tablet/desktop)',
            name: 'placementDesktop',
            component: 'radio-group',
            description: 'Placement in relation to grid tiles',
            direction: 'horizontal',
            variant: 'radio',
            options: [
              {label: 'Left', value: 'left'},
              {label: 'Right', value: 'right'},
            ],
            defaultValue: 'left',
          },
          {
            label: 'Placement (mobile)',
            name: 'placementMobile',
            component: 'radio-group',
            description: 'Placement in relation to grid tiles',
            direction: 'horizontal',
            variant: 'radio',
            options: [
              {label: 'Top', value: 'top'},
              {label: 'Bottom', value: 'bottom'},
            ],
            defaultValue: 'top',
          },
          {
            label: 'Image Aspect Ratio (tablet/desktop)',
            name: 'aspectRatioDesktop',
            component: 'select',
            description:
              'This aspect ratio will determine the aspect ratio of the secondary tiles grid layout',
            options: ASPECT_RATIOS_DESKTOP,
          },
          {
            label: 'Image Aspect Ratio (mobile)',
            name: 'aspectRatioMobile',
            component: 'select',
            options: ASPECT_RATIOS_MOBILE,
          },
          ...tileFields,
        ],
        defaultValue: DEFAULT_PRIMARY_TILE,
      },
      {
        label: 'Grid Tiles',
        name: 'grid',
        component: 'group',
        description: 'Grid layout, tiles content',
        fields: [
          {
            label: 'Grid Layout',
            name: 'gridLayout',
            component: 'select',
            options: [
              {label: '2 Wide Tiles', value: '2-wide'},
              {label: '2 Tall Tiles', value: '2-tall'},
              {label: '1 Wide Tile | 2 Square Tiles', value: '1-wide-2-square'},
              {label: '2 Square Tiles | 1 Wide Tile', value: '2-square-1-wide'},
              {label: '1 Tall Tile | 2 Square Tiles', value: '1-tall-2-square'},
              {label: '2 Square Tiles | 1 Tall Tile', value: '2-square-1-tall'},
              {label: '4 Square Tiles', value: '4-square'},
            ],
            defaultValue: '1-wide-2-square',
          },
          {
            label: 'Tiles',
            name: 'tiles',
            component: 'group-list',
            description:
              'The total number of tiles should match the total number of tiles per grid layout',
            itemProps: {
              label: '{{item.heading}}',
            },
            validate: {
              maxItems: 4,
            },
            fields: [
              {
                label: 'Image Aspect Ratio (mobile)',
                name: 'aspectRatioMobile',
                component: 'select',
                description:
                  'Tablet/desktop aspect ratio determined by placement in grid layout',
                options: ASPECT_RATIOS_MOBILE,
              },
              ...tileFields,
            ],
            defaultItem: {
              aspectRatioMobile: 'max-md:aspect-[4/3]',
              alt: 'Man in white and light tan outfit',
              image: {
                src: 'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/man-in-white-and-light-tan-outfit.jpg?v=1672348139',
              },
              positionDesktop: 'md:object-center',
              positionMobile: 'object-center',
              heading: 'Headline',
              buttons: [
                {
                  link: {
                    text: 'Shop Now',
                    url: '',
                  },
                },
              ],
              hideButton: false,
            },
            defaultValue: DEFAULT_SECONDARY_TILES,
          },
        ],
      },
      {
        label: 'Content Settings',
        name: 'content',
        component: 'group',
        description:
          'Dark overlay, content position, content alignment, tile heading size, clickable image',
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
            label: 'Clickable Image',
            name: 'clickableImage',
            component: 'toggle',
            description: `Makes entire image clickable using primary button's link; hides any secondary button`,
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
        ],
        defaultValue: {
          darkOverlay: true,
          contentPosition: 'justify-start items-end',
          contentAlign: 'left',
          tileHeadingSize: 'text-h4',
          clickableImage: true,
        },
      },
      {
        label: 'Section Settings',
        name: 'section',
        component: 'group',
        description:
          'Display settings per viewport, heading text color, full width',
        fields: [
          {
            label: 'Desktop Settings',
            name: 'desktop',
            component: 'group',
            description: 'Grid spacing, full bleed for desktop',
            fields: [
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
              gap: 'lg:gap-2',
              fullBleed: false,
            },
          },
          {
            label: 'Tablet Settings',
            name: 'tablet',
            component: 'group',
            description: 'Grid spacing, full bleed for tablet',
            fields: [
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
              gap: 'max-lg:gap-2',
              fullBleed: false,
            },
          },
          {
            label: 'Mobile Settings',
            name: 'mobile',
            component: 'group',
            description: 'Grid spacing, full bleed for mobile',
            fields: [
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
              gap: 'max-md:gap-2',
              fullBleed: false,
            },
          },
          {
            label: 'Heading Text Color',
            name: 'textColor',
            component: 'select',
            options: COLORS,
            defaultValue: 'var(--text)',
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
            defaultValue: false,
          },
        ],
      },
      containerSettings(),
    ],
  };
}
