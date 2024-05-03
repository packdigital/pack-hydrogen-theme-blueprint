import {
  BUTTONS,
  COLORS,
  FLEX_POSITIONS,
  OBJECT_POSITIONS,
  TEXT_COLORS,
} from '~/settings/common';
import {containerSettings} from '~/settings/container';

const image = {
  label: 'Image Settings',
  name: 'image',
  description: 'Image, image position',
  component: 'group',
  fields: [
    {
      label: 'Image Alt',
      name: 'alt',
      component: 'text',
      description: `Alt text set in media manager for selected image(s) will take priority. Re-add image(s) if alt text was set in media manager after selection.`,
    },
    {
      label: 'Image (tablet/desktop)',
      name: 'imageDesktop',
      component: 'image',
    },
    {
      label: 'Image Position (tablet/desktop)',
      name: 'positionDesktop',
      component: 'select',
      options: OBJECT_POSITIONS.desktop,
    },
    {
      label: 'Image (mobile)',
      name: 'imageMobile',
      component: 'image',
    },
    {
      label: 'Image Position (mobile)',
      name: 'positionMobile',
      component: 'select',
      options: OBJECT_POSITIONS.mobile,
    },
  ],
};

const video = {
  label: 'Video Settings',
  name: 'video',
  description: 'Video link, poster image',
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
      description: 'First frame of video while video loads',
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
      description: 'First frame of video while video loads',
    },
  ],
};

const text = {
  label: 'Text Settings',
  name: 'text',
  description: 'Heading, superheading, subheading, color',
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
      label: 'Subheading',
      name: 'subheading',
      component: 'text',
    },
    {
      label: 'Text Color (desktop)',
      name: 'colorDesktop',
      component: 'select',
      options: TEXT_COLORS.desktop,
    },
    {
      label: 'Text Color (mobile)',
      name: 'colorMobile',
      component: 'select',
      options: TEXT_COLORS.mobile,
    },
    {
      label: 'Hide Heading (desktop)',
      name: 'hideHeadingDesktop',
      component: 'toggle',
      description: 'Heading will be hidden but still available for SEO',
      toggleLabels: {
        true: 'On',
        false: 'Off',
      },
    },
    {
      label: 'Hide Heading (mobile)',
      name: 'hideHeadingMobile',
      component: 'toggle',
      description: 'Heading will be hidden but still available for SEO',
      toggleLabels: {
        true: 'On',
        false: 'Off',
      },
    },
  ],
};

const buttons = {
  label: 'Button Settings',
  name: 'button',
  description: 'Clickable slide, button links, button styles',
  component: 'group',
  fields: [
    {
      label: 'Entire Slide Clickable',
      name: 'clickableSlide',
      component: 'toggle',
      description: 'Makes entire slide clickable using the first link below',
      toggleLabels: {
        true: 'On',
        false: 'Off',
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
        link: {text: 'Shop All', url: ''},
        style: 'btn-primary',
      },
    },
    {
      label: 'Hide Buttons (desktop)',
      name: 'hideButtonsDesktop',
      component: 'toggle',
      toggleLabels: {
        true: 'On',
        false: 'Off',
      },
    },
    {
      label: 'Hide Buttons (mobile)',
      name: 'hideButtonsMobile',
      component: 'toggle',
      toggleLabels: {
        true: 'On',
        false: 'Off',
      },
    },
  ],
};

const content = {
  label: 'Content Settings',
  name: 'content',
  description: 'Dark overlay, content position, content alignment',
  component: 'group',
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
      label: 'Content Position (tablet/desktop)',
      name: 'positionDesktop',
      component: 'select',
      options: FLEX_POSITIONS.desktop,
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
      label: 'Content Position (mobile)',
      name: 'positionMobile',
      component: 'select',
      options: FLEX_POSITIONS.mobile,
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
    {
      label: 'Max Content Width (mobile)',
      name: 'maxWidthMobile',
      component: 'select',
      options: [
        {label: 'Narrow', value: 'max-w-[16.5rem]'},
        {label: 'Medium', value: 'max-w-[22.5rem]'},
        {label: 'Wide', value: 'max-w-[28.5rem]'},
        {label: 'Full', value: 'max-w-full'},
      ],
    },
  ],
};

const defaultSlide = {
  image: {
    alt: 'Three men outside wearing outerwear',
    imageDesktop: {
      src: 'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/tanya-pro-J2Cr4cBnN-0-unsplash_20_281_29.jpg?v=1672724643',
    },
    positionDesktop: 'md:object-center',
    imageMobile: {
      src: 'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/tanya-pro-J2Cr4cBnN-0-unsplash_20_281_29.jpg?v=1672724643',
    },
    positionMobile: 'object-center',
  },
  text: {
    heading: 'All new products\nthis season',
    superheading: '',
    subheading: 'New styles and new fits',
    colorDesktop: 'md:text-[var(--white)]',
    colorMobile: 'max-md:text-[var(--white)]',
    hideHeadingDesktop: false,
    hideHeadingMobile: false,
  },
  button: {
    clickableSlide: false,
    buttons: [
      {
        link: {
          text: 'Shop Now',
          url: '',
        },
        style: 'btn-primary',
      },
    ],
    hideButtonsDesktop: false,
    hideButtonsMobile: false,
  },
  content: {
    darkOverlay: false,
    alignmentDesktop: 'md:text-left md:items-start',
    positionDesktop: 'md:justify-start items-center',
    maxWidthDesktop: 'md:max-w-[30rem] lg:max-w-[38rem]',
    alignmentMobile: 'text-left items-start',
    positionMobile: 'justify-start items-center',
    maxWidthMobile: 'max-w-[22.5rem]',
  },
};

export const Schema = () => {
  return {
    category: 'Heros',
    label: 'Hero Slider',
    key: 'hero',
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/hero-preview_2cd7154c-7ec6-4846-84ca-85aaef836165.jpg?v=1675795229',
    fields: [
      {
        name: 'slides',
        label: 'Slides',
        component: 'group-list',
        itemProps: {
          label: '{{item.text.heading}}',
        },
        fields: [image, video, text, buttons, content],
        defaultValue: [defaultSlide],
        defaultItem: defaultSlide,
      },
      {
        label: 'Slider Settings',
        name: 'slider',
        description: 'Autoplay, delay, transition effect, bullet color',
        component: 'group',
        fields: [
          {
            label: 'Enable Autoplay',
            name: 'autoplay',
            component: 'toggle',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
          {
            label: 'Enable Pagination Bullets',
            name: 'pagination',
            component: 'toggle',
            description: 'Save and refresh page to observe change',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
          {
            label: 'Delay Between Transitions (ms)',
            name: 'delay',
            component: 'number',
          },
          {
            label: 'Effect Between Transitions',
            name: 'effect',
            component: 'radio-group',
            direction: 'horizontal',
            variant: 'radio',
            description: 'Save and refresh page to observe change',
            options: [
              {label: 'Slide', value: 'slide'},
              {label: 'Fade', value: 'fade'},
            ],
          },
          {
            label: 'Active Bullet Color',
            name: 'activeBulletColor',
            component: 'select',
            description: 'Save and refresh page to observe change',
            options: COLORS,
          },
        ],
        defaultValue: {
          autoplay: true,
          pagination: true,
          delay: 8000,
          effect: 'fade',
          activeBulletColor: 'var(--white)',
        },
      },
      {
        label: 'Section Settings',
        name: 'section',
        component: 'group',
        description: 'Above the fold, full width, full bleed, height',
        fields: [
          {
            label: 'Above The Fold',
            name: 'aboveTheFold',
            component: 'toggle',
            description: `Sets the first slide's heading as H1 and image load as eager`,
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
            description: 'Removes padding of this section',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
          {
            label: 'Height (tablet/desktop)',
            name: 'desktop',
            component: 'group',
            description: 'Static height, aspect ratio, min and max height',
            fields: [
              {
                label: 'Height Type',
                name: 'heightType',
                component: 'radio-group',
                direction: 'horizontal',
                variant: 'radio',
                options: [
                  {label: 'Static', value: 'static'},
                  {label: 'Aspect Ratio', value: 'aspect-ratio'},
                ],
              },
              {
                label: 'Static Height',
                name: 'staticHeight',
                component: 'select',
                description: 'If enabled, hero set to static height',
                options: [
                  {label: '200px', value: 'md:h-[12.5rem]'},
                  {label: '300px', value: 'md:h-[18.75rem]'},
                  {label: '400px', value: 'md:h-[25rem]'},
                  {label: '500px', value: 'md:h-[31.25rem]'},
                  {label: '600px', value: 'md:h-[37.5rem]'},
                  {label: '700px', value: 'md:h-[43.75rem]'},
                  {label: '800px', value: 'md:h-[50rem]'},
                ],
              },
              {
                label: 'Aspect Ratio',
                name: 'aspectRatio',
                component: 'select',
                description: `If enabled, hero set to width:height ratio.\nNative Aspect Ratio will use the aspect ratio from the first slide's image or poster image.`,
                options: [
                  {label: 'Native Aspect Ratio', value: 'native'},
                  {label: '3:1', value: 'md:aspect-[3/1]'},
                  {label: '5:2', value: 'md:aspect-[5/2]'},
                  {label: '2:1', value: 'md:aspect-[2/1]'},
                  {label: '16:9', value: 'md:aspect-[16/9]'},
                  {label: '3:2', value: 'md:aspect-[3/2]'},
                  {label: '4:3', value: 'md:aspect-[4/3]'},
                  {label: '5:4', value: 'md:aspect-[5/4]'},
                  {label: '1:1', value: 'md:aspect-[1/1]'},
                  {label: '4:5', value: 'md:aspect-[4/5]'},
                  {label: '3:4', value: 'md:aspect-[3/4]'},
                  {label: '2:3', value: 'md:aspect-[2/3]'},
                  {label: '9:16', value: 'md:aspect-[9/16]'},
                ],
              },
              {
                label: 'Aspect Ratio Min Height',
                name: 'minHeight',
                component: 'select',
                description: 'Min height on desktop regardless of aspect ratio',
                options: [
                  {label: 'None', value: ''},
                  {label: '200px', value: 'md:min-h-[12.5rem]'},
                  {label: '300px', value: 'md:min-h-[18.75rem]'},
                  {label: '400px', value: 'md:min-h-[25rem]'},
                  {label: '500px', value: 'md:min-h-[31.25rem]'},
                  {label: '600px', value: 'md:min-h-[37.5rem]'},
                  {label: '700px', value: 'md:min-h-[43.75rem]'},
                  {label: '800px', value: 'md:min-h-[50rem]'},
                ],
              },
              {
                label: 'Aspect Ratio Max Height',
                name: 'maxHeight',
                component: 'select',
                description: 'Max height aspect ratio can grow to on desktop',
                options: [
                  {label: 'None', value: ''},
                  {label: '200px', value: 'md:max-h-[12.5rem]'},
                  {label: '300px', value: 'md:max-h-[18.75rem]'},
                  {label: '400px', value: 'md:max-h-[25rem]'},
                  {label: '500px', value: 'md:max-h-[31.25rem]'},
                  {label: '600px', value: 'md:max-h-[37.5rem]'},
                  {label: '700px', value: 'md:max-h-[43.75rem]'},
                  {label: '800px', value: 'md:max-h-[50rem]'},
                ],
              },
            ],
            defaultValue: {
              heightType: 'static',
              staticHeight: 'md:h-[43.75rem]',
              aspectRatio: 'md:aspect-[16/9]',
              minHeight: '',
              maxHeight: '',
            },
          },
          {
            label: 'Height (mobile)',
            name: 'mobile',
            component: 'group',
            description: 'Static height, aspect ratio, min and max height',
            fields: [
              {
                label: 'Height Type',
                name: 'heightType',
                component: 'radio-group',
                direction: 'horizontal',
                variant: 'radio',
                options: [
                  {label: 'Static', value: 'static'},
                  {label: 'Aspect Ratio', value: 'aspect-ratio'},
                ],
              },
              {
                label: 'Static Height',
                name: 'staticHeight',
                component: 'select',
                description: 'If enabled, hero set to static height',
                options: [
                  {label: '200px', value: 'max-md:h-[12.5rem]'},
                  {label: '300px', value: 'max-md:h-[18.75rem]'},
                  {label: '400px', value: 'max-md:h-[25rem]'},
                  {label: '500px', value: 'max-md:h-[31.25rem]'},
                  {label: '600px', value: 'max-md:h-[37.5rem]'},
                  {label: '700px', value: 'max-md:h-[43.75rem]'},
                  {label: '800px', value: 'max-md:h-[50rem]'},
                ],
              },
              {
                label: 'Aspect Ratio',
                name: 'aspectRatio',
                component: 'select',
                description: `If enabled, hero set to width:height ratio.\nNative Aspect Ratio will use the aspect ratio from the first slide's image or poster image.`,
                options: [
                  {label: 'Native Aspect Ratio', value: 'native'},
                  {label: '3:1', value: 'max-md:aspect-[3/1]'},
                  {label: '5:2', value: 'max-md:aspect-[5/2]'},
                  {label: '2:1', value: 'max-md:aspect-[2/1]'},
                  {label: '16:9', value: 'max-md:aspect-[16/9]'},
                  {label: '3:2', value: 'max-md:aspect-[3/2]'},
                  {label: '4:3', value: 'max-md:aspect-[4/3]'},
                  {label: '5:4', value: 'max-md:aspect-[5/4]'},
                  {label: '1:1', value: 'max-md:aspect-[1/1]'},
                  {label: '4:5', value: 'max-md:aspect-[4/5]'},
                  {label: '3:4', value: 'max-md:aspect-[3/4]'},
                  {label: '2:3', value: 'max-md:aspect-[2/3]'},
                  {label: '9:16', value: 'max-md:aspect-[9/16]'},
                ],
              },
              {
                label: 'Aspect Ratio Min Height',
                name: 'minHeight',
                component: 'select',
                description: 'Min height on mobile regardless of aspect ratio',
                options: [
                  {label: 'None', value: ''},
                  {label: '200px', value: 'max-md:min-h-[12.5rem]'},
                  {label: '300px', value: 'max-md:min-h-[18.75rem]'},
                  {label: '400px', value: 'max-md:min-h-[25rem]'},
                  {label: '500px', value: 'max-md:min-h-[31.25rem]'},
                  {label: '600px', value: 'max-md:min-h-[37.5rem]'},
                  {label: '700px', value: 'max-md:min-h-[43.75rem]'},
                  {label: '800px', value: 'max-md:min-h-[50rem]'},
                ],
              },
              {
                label: 'Aspect Ratio Max Height',
                name: 'maxHeight',
                component: 'select',
                description: 'Max height aspect ratio can grow to on mobile',
                options: [
                  {label: 'None', value: ''},
                  {label: '200px', value: 'max-md:max-h-[12.5rem]'},
                  {label: '300px', value: 'max-md:max-h-[18.75rem]'},
                  {label: '400px', value: 'max-md:max-h-[25rem]'},
                  {label: '500px', value: 'max-md:max-h-[31.25rem]'},
                  {label: '600px', value: 'max-md:max-h-[37.5rem]'},
                  {label: '700px', value: 'max-md:max-h-[43.75rem]'},
                  {label: '800px', value: 'max-md:max-h-[50rem]'},
                ],
              },
            ],
            defaultValue: {
              heightType: 'static',
              staticHeight: 'max-md:h-[31.25rem]',
              aspectRatio: 'max-md:aspect-[3/4]',
              minHeight: '',
              maxHeight: '',
            },
          },
        ],
        defaultValue: {
          aboveTheFold: true,
          fullWidth: true,
          fullBleed: true,
        },
      },
      containerSettings(),
    ],
  };
};
