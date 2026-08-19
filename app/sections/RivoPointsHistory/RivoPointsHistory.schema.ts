import {
  COLOR_PICKER_DEFAULTS,
  COLOR_SCHEMA_DEFAULT_VALUE,
} from '~/settings/common';
import {containerSettings} from '~/settings/container';

export function Schema() {
  return {
    category: 'Loyalty',
    label: 'Rivo Points History',
    key: 'rivo-points-history',
    fields: [
      {
        label: 'Heading',
        name: 'heading',
        component: 'text',
        defaultValue: 'Points activity',
      },
      {
        label: 'Labels',
        name: 'labels',
        component: 'group',
        description: 'Empty state and signed-out message',
        fields: [
          {
            label: 'Empty Message',
            name: 'emptyMessage',
            component: 'text',
            defaultValue: 'No activity yet.',
          },
          {
            label: 'Signed Out Message',
            name: 'signedOutMessage',
            component: 'text',
            defaultValue: 'Sign in to see your history.',
          },
          {
            label: 'Sign In Button Text',
            name: 'signInText',
            component: 'text',
            defaultValue: 'Sign in',
          },
        ],
        defaultValue: {
          emptyMessage: 'No activity yet.',
          signedOutMessage: 'Sign in to see your history.',
          signInText: 'Sign in',
        },
      },
      {
        label: 'Section Settings',
        name: 'section',
        component: 'group',
        description: 'Entries shown, text color, full width',
        fields: [
          {
            label: 'Entries Shown',
            name: 'limit',
            component: 'number',
            defaultValue: 10,
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
          limit: 10,
          textColor: COLOR_SCHEMA_DEFAULT_VALUE.text,
          fullWidth: false,
        },
      },
      containerSettings(),
    ],
  };
}
