import {containerSettings} from '~/settings/container';
import {COLORS} from '~/settings/common';

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
        label: 'Center All Text',
        name: 'centerAllText',
        component: 'toggle',
        toggleLabels: {
          true: 'On',
          false: 'Off',
        },
        defaultValue: false,
      },
      {
        label: 'Section Settings',
        name: 'section',
        component: 'group',
        description: 'Max content width, text color',
        fields: [
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
            component: 'select',
            options: COLORS,
          },
        ],
        defaultValue: {
          maxWidth: 'max-w-[60rem]',
          textColor: 'var(--text)',
        },
      },
      containerSettings(),
    ],
  };
}
