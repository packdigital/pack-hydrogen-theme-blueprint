import {containerSettings} from '~/settings/container';
import {
  COLOR_PICKER_DEFAULTS,
  COLOR_SCHEMA_DEFAULT_VALUE,
} from '~/settings/common';

export function Schema() {
  return {
    category: 'Text',
    label: 'Rich Text',
    key: 'rich-text',
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0629/5519/2520/files/CleanShot_2025-04-02_at_15.55.30_2x_02bc36ac-3561-4b4b-8c14-c1045d38b6ba.png?v=1743634551',
    fields: [
      {
        label: 'Rich Text Field',
        name: 'richtext',
        component: 'rich-text',
        defaultValue: `<h1>Welcome to Your Amazing <span style="color: #3D7AF3">Store</span>!</h1><p>This is where your <strong>brilliant product description</strong> should go. Instead, you're reading placeholder text because someone forgot to update this field (looking at you, dev team).</p><p>Things you could be writing about instead:</p><ul><li>Why your product will change lives</li><li>The incredible features no one else has</li><li>How you stayed up all night perfecting this <strong>very description</strong></li></ul><p>Need inspiration? Check out <a href="https://packdigital.com">Pack</a> or just keep this text and see how long until someone notices!</p>`,
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
            description: 'Inline color style will take priority',
          },
        ],
        defaultValue: {
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
