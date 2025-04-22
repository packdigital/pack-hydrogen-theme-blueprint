import {containerSettings} from '~/settings/container';
import {
  COLOR_PICKER_DEFAULTS,
  COLOR_SCHEMA_DEFAULT_VALUE,
} from '~/settings/common';

export function Schema() {
  return {
    category: 'Text',
    label: 'Markdown',
    key: 'markdown',
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/markdown-preview.jpg?v=1675730328',
    fields: [
      {
        label: 'Content',
        name: 'content',
        component: 'markdown',
        defaultValue: `**Lorem ipsum dolor sit amet**, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea _commodo consequat_.`,
      },
      {
        label: 'Section Settings',
        name: 'section',
        component: 'group',
        description: 'Center text, max content width, text color',
        fields: [
          {
            label: 'Center All Text',
            name: 'centerAllText',
            component: 'toggle',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
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
          centerAllText: false,
          hasXPadding: true,
          hasYPadding: true,
          maxWidth: 'max-w-[60rem]',
          textColor: COLOR_SCHEMA_DEFAULT_VALUE.text,
        },
      },
      containerSettings(),
    ],
  };
}
