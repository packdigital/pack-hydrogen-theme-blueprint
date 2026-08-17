import {
  BUTTONS,
  COLOR_PICKER_DEFAULTS,
  COLOR_SCHEMA_DEFAULT_VALUE,
  OBJECT_POSITIONS,
} from '~/settings/common';
import {containerSettings} from '~/settings/container';

export function Schema() {
  return {
    category: 'Loyalty',
    label: 'Rivo Loyalty Hero',
    key: 'rivo-loyalty-hero',
    fields: [
      {
        label: 'Eyebrow',
        name: 'eyebrow',
        component: 'text',
        defaultValue: 'Free to join',
      },
      {
        label: 'Heading',
        name: 'heading',
        component: 'text',
        defaultValue: 'Rewards',
      },
      {
        label: 'Subtext',
        name: 'subtext',
        component: 'text',
        defaultValue:
          'Join our rewards program to start earning points on every purchase.',
      },
      {
        label: 'Logo / Image',
        name: 'image',
        component: 'image',
        description: 'Optional program logo shown above the heading',
      },
      {
        label: 'Background Image',
        name: 'backgroundImage',
        component: 'group',
        description:
          'Full-bleed image behind the hero content. Set both breakpoints, or one and it is used for both.',
        fields: [
          {
            label: 'Image Alt',
            name: 'alt',
            component: 'text',
            description:
              'Alt text set in the media manager takes priority. Leave blank for a purely decorative background.',
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
          {
            label: 'Dark Overlay',
            name: 'darkOverlay',
            component: 'toggle',
            description:
              'Adds a 20% black overlay so light text stays readable over the image',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
          {
            label: 'Min Height (tablet/desktop)',
            name: 'minHeightDesktop',
            component: 'select',
            options: [
              {label: 'Auto', value: 'md:min-h-0'},
              {label: 'Small (24rem)', value: 'md:min-h-[24rem]'},
              {label: 'Medium (32rem)', value: 'md:min-h-[32rem]'},
              {label: 'Large (40rem)', value: 'md:min-h-[40rem]'},
              {label: 'Screen', value: 'md:min-h-screen'},
            ],
          },
          {
            label: 'Min Height (mobile)',
            name: 'minHeightMobile',
            component: 'select',
            options: [
              {label: 'Auto', value: 'max-md:min-h-0'},
              {label: 'Small (20rem)', value: 'max-md:min-h-[20rem]'},
              {label: 'Medium (24rem)', value: 'max-md:min-h-[24rem]'},
              {label: 'Large (32rem)', value: 'max-md:min-h-[32rem]'},
              {label: 'Screen', value: 'max-md:min-h-screen'},
            ],
          },
        ],
        defaultValue: {
          alt: '',
          positionDesktop: 'md:object-center',
          positionMobile: 'object-center',
          darkOverlay: true,
          minHeightDesktop: 'md:min-h-[32rem]',
          minHeightMobile: 'max-md:min-h-[24rem]',
        },
      },
      {
        label: 'Guest Buttons',
        name: 'buttons',
        component: 'group-list',
        description:
          'Shown to visitors who are not signed in. Max of two buttons.',
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
          link: {text: 'Join now', url: '/account/login'},
          style: 'btn-primary',
        },
        defaultValue: [
          {
            link: {text: 'Join now', url: '/account/login'},
            style: 'btn-primary',
          },
          {
            link: {text: 'Sign in', url: '/account/login'},
            style: 'btn-secondary',
          },
        ],
      },
      {
        label: 'Member State',
        name: 'member',
        component: 'group',
        description: 'Copy shown once a customer is signed in',
        fields: [
          {
            label: 'Greeting',
            name: 'greeting',
            component: 'text',
            description: 'Use {{name}} for the customer’s first name',
            defaultValue: 'Welcome back, {{name}}',
          },
          {
            label: 'Greeting Fallback',
            name: 'greetingFallback',
            component: 'text',
            description: 'Used when no first name is available',
            defaultValue: 'Welcome back',
          },
          {
            label: 'Points Suffix',
            name: 'pointsSuffix',
            component: 'text',
            defaultValue: 'points available',
          },
          {
            label: 'Tier Prefix',
            name: 'tierPrefix',
            component: 'text',
            defaultValue: 'Your tier',
          },
          {
            label: 'Link',
            name: 'link',
            component: 'link',
          },
          {
            label: 'Link Style',
            name: 'linkStyle',
            component: 'select',
            options: BUTTONS,
          },
        ],
        defaultValue: {
          greeting: 'Welcome back, {{name}}',
          greetingFallback: 'Welcome back',
          pointsSuffix: 'points available',
          tierPrefix: 'Your tier',
          link: {text: 'Redeem points', url: ''},
          linkStyle: 'btn-primary',
        },
      },
      {
        label: 'Section Settings',
        name: 'section',
        component: 'group',
        description: 'Above the fold, colors, full width',
        fields: [
          {
            label: 'Above The Fold',
            name: 'aboveTheFold',
            component: 'toggle',
            description: 'Sets the heading as H1. On by default for a hero.',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
          {
            label: 'Background Color',
            name: 'bgColor',
            component: 'color',
            colors: COLOR_PICKER_DEFAULTS,
          },
          {
            label: 'Text Color',
            name: 'textColor',
            component: 'color',
            colors: COLOR_PICKER_DEFAULTS,
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
          aboveTheFold: true,
          bgColor: COLOR_SCHEMA_DEFAULT_VALUE.background,
          textColor: COLOR_SCHEMA_DEFAULT_VALUE.text,
          fullWidth: false,
        },
      },
      containerSettings(),
    ],
  };
}
