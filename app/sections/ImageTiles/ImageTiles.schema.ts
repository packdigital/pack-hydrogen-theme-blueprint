import {FLEX_POSITIONS, CROP_POSITIONS} from '~/settings/common';
import {containerSettings} from '~/settings/container';

export function Schema() {
  return {
    category: 'Media',
    label: 'Image Tiles Row',
    key: 'image-tiles',
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/image-tiles-preview.jpg?v=1675730325',
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
        label: 'Tiles',
        name: 'tiles',
        description: 'Min of 2 tiles, max of 3 tiles',
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
          'Dark overlay, content position, button styles, clickable image, hide buttons',
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
            label: 'Primary Button Style',
            name: 'primaryButtonStyle',
            component: 'select',
            options: [
              {label: 'Primary', value: 'btn-primary'},
              {label: 'Secondary', value: 'btn-secondary'},
              {label: 'Inverse Light', value: 'btn-inverse-light'},
              {label: 'Inverse Dark', value: 'btn-inverse-dark'},
            ],
          },
          {
            label: 'Secondary Button Style',
            name: 'secondaryButtonStyle',
            component: 'select',
            options: [
              {label: 'Primary', value: 'btn-primary'},
              {label: 'Secondary', value: 'btn-secondary'},
              {label: 'Inverse Light', value: 'btn-inverse-light'},
              {label: 'Inverse Dark', value: 'btn-inverse-dark'},
            ],
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
        description: 'Image aspect ratio, full width',
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
          aspectRatio: 'aspect-[3/4]',
          fullWidth: false,
        },
      },
      containerSettings(),
    ],
  };
}
