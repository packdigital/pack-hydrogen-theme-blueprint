import type {BannerCms} from '~/sections/Banner/Banner.types';
import {
  BUTTONS,
  COLORS,
  FLEX_POSITIONS,
  OBJECT_POSITIONS,
} from '~/settings/common';

export type NotFoundSettings = BannerCms;

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
      description:
        'Alt text set in media manager for selected image(s) will take priority. Re-add image(s) if alt text was set in media manager after selection.',
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
  defaultValue: {
    alt: 'Rack of green t-shirts',
    imageDesktop: {
      src: 'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/keagan-henman-xPJYL0l5Ii8-unsplash_20_281_29.jpg?v=1672349016',
    },
    positionDesktop: 'md:object-center',
    imageMobile: {
      src: 'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/keagan-henman-xPJYL0l5Ii8-unsplash_20_281_29.jpg?v=1672349016',
    },
    positionMobile: 'object-center',
  },
};

const text = {
  label: 'Text Settings',
  name: 'text',
  description: 'Heading, subheading, color, buttons',
  component: 'group',
  fields: [
    {
      label: 'Heading',
      name: 'heading',
      component: 'textarea',
    },
    {
      label: 'Subheading',
      name: 'subheading',
      component: 'text',
    },
    {
      label: 'Text Color',
      name: 'color',
      component: 'select',
      options: COLORS,
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
        link: {text: 'Continue Shopping', url: '/'},
        style: 'btn-primary',
      },
    },
  ],
  defaultValue: {
    heading: 'Page Not Found',
    color: 'var(--white)',
    buttons: [
      {
        link: {
          text: 'Continue Shopping',
          url: '/',
        },
        style: 'btn-primary',
      },
    ],
  },
};

const content = {
  label: 'Content Settings',
  name: 'content',
  description: 'Dark overlay, content position, content alignment',
  component: 'group',
  fields: [
    {
      label: 'Enable Dark Overlay',
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
  defaultValue: {
    darkOverlay: false,
    alignmentDesktop: 'md:text-center md:items-center',
    positionDesktop: 'md:justify-center md:items-center',
    maxWidthDesktop: 'md:max-w-[30rem] lg:max-w-[38rem]',
    alignmentMobile: 'text-center items-center',
    positionMobile: 'justify-center items-center',
    maxWidthMobile: 'max-w-[22.5rem]',
  },
};

export default {
  label: 'Not Found (404)',
  name: 'notFound',
  component: 'group',
  description: 'Not found page',
  fields: [
    image,
    text,
    content,
    {
      label: 'Container Settings',
      name: 'section',
      component: 'group',
      description: 'Background color, full width, full bleed, height',
      fields: [
        {
          label: 'Background Color (if no image)',
          name: 'bgColor',
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
                {label: 'Auto', value: 'md:h-auto'},
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
              description: `If enabled, hero set to width:height ratio.\nNative Aspect Ratio will use the aspect ratio from the image.`,
              options: [
                {label: 'Native Aspect Ratio', value: 'native'},
                {label: '5:1', value: 'md:aspect-[5/1]'},
                {label: '4:1', value: 'md:aspect-[4/1]'},
                {label: '3:1', value: 'md:aspect-[3/1]'},
                {label: '5:2', value: 'md:aspect-[5/2]'},
                {label: '2:1', value: 'md:aspect-[2/1]'},
                {label: '16:9', value: 'md:aspect-[16/9]'},
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
            staticHeight: 'md:h-[50rem]',
            aspectRatio: 'md:aspect-[4/1]',
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
                {label: 'Auto', value: 'max-md:h-auto'},
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
              description: `If enabled, hero set to width:height ratio.\nNative Aspect Ratio will use the aspect ratio from the image.`,
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
            aspectRatio: 'max-md:aspect-[3/1]',
            minHeight: '',
            maxHeight: '',
          },
        },
      ],
      defaultValue: {
        aboveTheFold: true,
        bgColor: 'var(--off-white)',
        fullWidth: true,
        fullBleed: true,
      },
    },
  ],
};
