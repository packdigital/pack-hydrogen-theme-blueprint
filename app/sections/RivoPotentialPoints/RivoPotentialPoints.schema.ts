import {
  COLOR_PICKER_DEFAULTS,
  COLOR_SCHEMA_DEFAULT_VALUE,
} from '~/settings/common';
import {containerSettings} from '~/settings/container';

export function Schema({template}: {template: string}) {
  // Product template only: the panel prices the product it sits on.
  if (template !== 'product') return null;

  return {
    category: 'Loyalty',
    label: 'Rivo Potential Points',
    key: 'rivo-potential-points',
    fields: [
      {
        label: 'Heading',
        name: 'heading',
        component: 'text',
        description:
          'Use {{points}} for the calculated amount. The earning rate itself is configured in Rivo admin',
        defaultValue: 'Order and get {{points}} reward points',
      },
      {
        label: 'Subtext',
        name: 'subtext',
        component: 'text',
        defaultValue: 'Earn points by joining our rewards program',
      },
      {
        label: 'Icon',
        name: 'image',
        component: 'image',
      },
      {
        label: 'Section Settings',
        name: 'section',
        component: 'group',
        description: 'Logged-out only, background color, text color',
        fields: [
          {
            label: 'Only Show To Logged Out Customers',
            name: 'loggedOutOnly',
            component: 'toggle',
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
        ],
        defaultValue: {
          loggedOutOnly: false,
          textColor: COLOR_SCHEMA_DEFAULT_VALUE.text,
        },
      },
      containerSettings(),
    ],
  };
}
