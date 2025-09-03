import {containerSettings} from '~/settings/container';
import {
  COLOR_PICKER_DEFAULTS,
  COLOR_SCHEMA_DEFAULT_VALUE,
} from '~/settings/common';

export function Schema() {
  return {
    category: 'HTML',
    label: 'HTML',
    key: 'html',
    fields: [
      {
        label: 'HTML',
        name: 'html',
        component: 'html',
        description:
          'Default HTML sanitization does not allow scripts. To authorize specific script domains, adjust the sanitization filters in the code directly',
      },
      {
        label: 'Content Settings',
        name: 'content',
        component: 'group',
        description: 'Content alignment, text alignment',
        fields: [
          {
            label: 'Content Alignment',
            name: 'contentAlign',
            component: 'radio-group',
            direction: 'horizontal',
            variant: 'radio',
            options: [
              {label: 'Left', value: 'items-start'},
              {label: 'Center', value: 'items-center'},
              {label: 'Right', value: 'items-end'},
            ],
          },
          {
            label: 'Text Alignment',
            name: 'textAlign',
            component: 'radio-group',
            direction: 'horizontal',
            variant: 'radio',
            options: [
              {label: 'Left', value: 'text-left'},
              {label: 'Center', value: 'text-center'},
              {label: 'Right', value: 'text-right'},
            ],
          },
        ],
        defaultValue: {
          contentAlign: 'items-start',
          textAlign: 'text-left',
        },
      },
      {
        label: 'Section Settings',
        name: 'section',
        component: 'group',
        description: 'Padding, max content width, text color',
        fields: [
          {
            label: 'Horizontal Padding',
            name: 'hasXPadding',
            component: 'toggle',
            description: 'Adds default horizontal padding around section',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
          {
            label: 'Vertical Padding',
            name: 'hasYPadding',
            component: 'toggle',
            description: 'Adds default vertical padding around section',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
          {
            label: 'Max Content Width',
            name: 'maxWidth',
            component: 'select',
            options: [
              {
                label: 'Narrow',
                value: 'max-w-[30rem]',
              },
              {
                label: 'Medium Narrow',
                value: 'max-w-[45rem]',
              },
              {
                label: 'Medium',
                value: 'max-w-[60rem]',
              },
              {
                label: 'Medium Wide',
                value: 'max-w-[75rem]',
              },
              {
                label: 'Wide',
                value: 'max-w-[90rem]',
              },
              {label: 'Full', value: 'max-w-full'},
            ],
          },
          {
            label: 'Text Color',
            name: 'textColor',
            component: 'color',
            colors: COLOR_PICKER_DEFAULTS,
          },
        ],
        defaultValue: {
          hasXPadding: false,
          hasYPadding: false,
          maxWidth: 'max-w-full',
          textColor: COLOR_SCHEMA_DEFAULT_VALUE.text,
        },
      },
      containerSettings(),
    ],
  };
}
