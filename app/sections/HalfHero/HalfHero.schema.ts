import {BUTTONS, COLORS, CROP_POSITIONS} from '~/settings/common';
import {containerSettings} from '~/settings/container';

const media = {
  label: 'Media Settings',
  name: 'media',
  description: 'Image settings, video settings, order, aspect ratio',
  component: 'group',
  fields: [
    {
      label: 'Image Settings',
      name: 'image',
      description: 'Image, image position',
      component: 'group',
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
          label: 'Image Crop Position (mobile)',
          name: 'cropMobile',
          component: 'select',
          options: CROP_POSITIONS,
        },
      ],
    },
    {
      label: 'Video Settings',
      name: 'video',
      description: 'Video link, poster image, autoplay, sound',
      component: 'group',
      fields: [
        {
          label: 'Video URL (tablet/desktop)',
          name: 'srcDesktop',
          component: 'text',
          description:
            'Overrides tablet/desktop image option. Must be a direct link, not a share link',
        },
        {
          label: 'Poster Image (tablet/desktop)',
          name: 'posterDesktop',
          component: 'image',
        },
        {
          label: 'Video URL (mobile)',
          name: 'srcMobile',
          component: 'text',
          description:
            'Overrides mobile image option. Must be a direct link, not a share link',
        },
        {
          label: 'Poster Image (mobile)',
          name: 'posterMobile',
          component: 'image',
        },
        {
          label: 'Autoplay When In View',
          name: 'autoplay',
          component: 'toggle',
          description:
            'Disabling controls video through play button instead. Also applies muted and loop attributes',
          toggleLabels: {
            true: 'On',
            false: 'Off',
          },
        },
        {
          label: 'Sound',
          name: 'sound',
          component: 'toggle',
          description:
            'Only applicable if autoplay is off. Also applies controls attribute',
          toggleLabels: {
            true: 'On',
            false: 'Off',
          },
        },
      ],
    },
    {
      label: 'Media Order (tablet/desktop)',
      name: 'mediaOrderDesktop',
      component: 'radio-group',
      direction: 'horizontal',
      variant: 'radio',
      options: [
        {label: 'Left', value: '1'},
        {label: 'Right', value: '2'},
      ],
    },
    {
      label: 'Media Aspect Ratio (tablet/desktop)',
      name: 'aspectDesktop',
      component: 'select',
      options: [
        {label: '3:2', value: 'md:before:pb-[67%]'},
        {label: '4:3', value: 'md:before:pb-[75%]'},
        {label: '5:4', value: 'md:before:pb-[80%]'},
        {label: '8:7', value: 'md:before:pb-[87.5%]'},
        {label: '1:1', value: 'md:before:pb-[100%]'},
        {label: '7:8', value: 'md:before:pb-[114%]'},
        {label: '4:5', value: 'md:before:pb-[125%]'},
        {label: '3:4', value: 'md:before:pb-[133%]'},
        {label: '2:3', value: 'md:before:pb-[150%]'},
      ],
    },
    {
      label: 'Fill Empty Space (tablet/desktop)',
      name: 'fill',
      component: 'toggle',
      description:
        'Fill any vertical empty space with media. Applicable only to tablet and desktop',
      toggleLabels: {
        true: 'On',
        false: 'Off',
      },
    },
    {
      label: 'Media Order (mobile)',
      name: 'mediaOrderMobile',
      component: 'radio-group',
      direction: 'horizontal',
      variant: 'radio',
      options: [
        {label: 'Top', value: '1'},
        {label: 'Bottom', value: '2'},
      ],
    },
    {
      label: 'Media Aspect Ratio (mobile)',
      name: 'aspectMobile',
      component: 'select',
      options: [
        {label: '3:2', value: 'max-md:before:pb-[67%]'},
        {label: '4:3', value: 'max-md:before:pb-[75%]'},
        {label: '5:4', value: 'max-md:before:pb-[80%]'},
        {label: '8:7', value: 'max-md:before:pb-[87.5%]'},
        {label: '1:1', value: 'max-md:before:pb-[100%]'},
        {label: '7:8', value: 'max-md:before:pb-[114%]'},
        {label: '4:5', value: 'max-md:before:pb-[125%]'},
        {label: '3:4', value: 'max-md:before:pb-[133%]'},
        {label: '2:3', value: 'max-md:before:pb-[150%]'},
      ],
    },
  ],
  defaultValue: {
    image: {
      alt: 'Man with backpack crossing the street',
      imageDesktop: {
        src: 'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/mad-rabbit-tattoo-tn1yJqxNj-8-unsplash.jpg?v=1672787927',
      },
      cropDesktop: 'center',
      imageMobile: {
        src: 'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/mad-rabbit-tattoo-tn1yJqxNj-8-unsplash.jpg?v=1672787927',
      },
      cropMobile: 'center',
    },
    video: {
      autoplay: true,
      sound: false,
    },
    mediaOrderDesktop: '1',
    aspectDesktop: 'md:before:pb-[100%]',
    fill: true,
    mediaOrderMobile: '1',
    aspectMobile: 'max-md:before:pb-[100%]',
  },
};

const content = {
  label: 'Content Settings',
  name: 'content',
  description:
    'Heading, superheading, subtext, buttons, text color, alignment, content width',
  component: 'group',
  fields: [
    {
      label: 'Heading',
      name: 'heading',
      component: 'textarea',
    },
    {
      label: 'Superheading',
      name: 'superheading',
      component: 'text',
    },
    {
      label: 'Subtext',
      name: 'subtext',
      component: 'markdown',
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
    {
      label: 'Text Color',
      name: 'color',
      component: 'select',
      options: COLORS,
    },
    {
      label: 'Content Alignment (tablet/desktop)',
      name: 'alignmentDesktop',
      component: 'radio-group',
      direction: 'horizontal',
      variant: 'radio',
      options: [
        {label: 'Left', value: 'md:text-left md:items-start'},
        {label: 'Center', value: 'md:text-center md:items-center'},
        {label: 'Right', value: 'md:text-right md:items-end'},
      ],
    },
    {
      label: 'Max Content Width (tablet/desktop)',
      name: 'maxWidthDesktop',
      component: 'select',
      options: [
        {label: 'Narrow', value: 'md:max-w-[22rem] lg:max-w-[28rem]'},
        {label: 'Medium', value: 'md:max-w-[30rem] lg:max-w-[38rem]'},
        {label: 'Wide', value: 'md:max-w-[38rem] lg:max-w-[48rem]'},
        {label: 'Full', value: 'md:max-w-full'},
      ],
    },
    {
      label: 'Content Alignment (mobile)',
      name: 'alignmentMobile',
      component: 'radio-group',
      direction: 'horizontal',
      variant: 'radio',
      options: [
        {label: 'Left', value: 'text-left items-start'},
        {label: 'Center', value: 'text-center items-center'},
        {label: 'Right', value: 'text-right items-end'},
      ],
    },
  ],
  defaultValue: {
    heading: 'Half Hero Heading',
    superheading: '',
    subtext:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    buttons: [
      {
        link: {text: 'Shop Now', url: ''},
        style: 'btn-primary',
      },
    ],
    color: 'var(--text)',
    alignmentDesktop: 'md:text-left md:items-start',
    maxWidthDesktop: 'md:max-w-[30rem] lg:max-w-[38rem]',
    alignmentMobile: 'text-left items-start',
  },
};

export const Schema = () => {
  return {
    category: 'Heros',
    label: 'Half Hero',
    key: 'half-hero',
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/half-hero-preview_396b489b-da92-490a-b59d-87b2c9467c67.jpg?v=1675795226',
    fields: [
      media,
      content,
      {
        label: 'Section Settings',
        name: 'section',
        component: 'group',
        description: 'Above the fold, full width, full bleed, vertical padding',
        fields: [
          {
            label: 'Above The Fold',
            name: 'aboveTheFold',
            component: 'toggle',
            description: `Sets the heading as H1 and image load as eager`,
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
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
          {
            label: 'Full Bleed',
            name: 'fullBleed',
            component: 'toggle',
            description: 'Removes horizontal padding of this section',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
          {
            label: 'Vertical Padding',
            name: 'verticalPadding',
            component: 'toggle',
            description: 'Adds vertical padding to this section',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
        ],
        defaultValue: {
          aboveTheFold: false,
          fullWidth: true,
          fullBleed: true,
          verticalPadding: false,
        },
      },
      containerSettings(),
    ],
  };
};
