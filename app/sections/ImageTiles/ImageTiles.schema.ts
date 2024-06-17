import {
  BUTTONS,
  COLORS,
  CONTENT_ALIGN,
  FLEX_POSITIONS,
  CROP_POSITIONS,
  HEADING_SIZES,
} from '~/settings/common';
import {containerSettings} from '~/settings/container';

export function Schema() {
  return {
    category: 'Media',
    label: 'Image Tiles Slider',
    key: 'image-tiles',
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/image-tiles-preview.jpg?v=1675730325',
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
        defaultValue: [
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
        ],
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
          'Tiles per view, image aspect ratio, heading text color, full width',
        fields: [
          {
            label: 'Tiles Per View (desktop)',
            name: 'tilesPerViewDesktop',
            description: 'Save and refresh page to observe change',
            component: 'number',
          },
          {
            label: 'Tiles Per View (tablet)',
            name: 'tilesPerViewTablet',
            component: 'number',
            description:
              'Save and refresh page to observe change\nTip: use decimals to show partial tiles',
          },
          {
            label: 'Tiles Per View (mobile)',
            name: 'tilesPerViewMobile',
            component: 'number',
            description:
              'Save and refresh page to observe change\nTip: use decimals to show partial tiles',
          },
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
          tilesPerViewDesktop: 3,
          tilesPerViewTablet: 2.4,
          tilesPerViewMobile: 1.4,
          aspectRatio: 'aspect-[3/4]',
          textColor: 'var(--text)',
          fullWidth: false,
        },
      },
      containerSettings(),
    ],
  };
}
