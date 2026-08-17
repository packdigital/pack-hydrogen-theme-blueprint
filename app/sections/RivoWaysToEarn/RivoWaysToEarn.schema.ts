import {
  COLOR_PICKER_DEFAULTS,
  COLOR_SCHEMA_DEFAULT_VALUE,
} from '~/settings/common';
import {containerSettings} from '~/settings/container';

export function Schema() {
  return {
    category: 'Loyalty',
    label: 'Rivo Ways To Earn',
    key: 'rivo-ways-to-earn',
    fields: [
      {
        label: 'Eyebrow',
        name: 'eyebrow',
        component: 'text',
        defaultValue: 'Rewards with benefits',
      },
      {
        label: 'Heading',
        name: 'heading',
        component: 'text',
        defaultValue: 'How to earn',
      },
      {
        label: 'Subtext',
        name: 'subtext',
        component: 'text',
        defaultValue: 'Earn points on every order and action. It’s that easy.',
      },
      {
        label: 'Icons',
        name: 'icons',
        component: 'group-list',
        description:
          'Optional icons matched to a Rivo earning rule by its trigger key, e.g. order_placed, customer_birthday, customer_member_enabled, tiktok_follow',
        itemProps: {
          label: '{{item.trigger}}',
        },
        fields: [
          {
            label: 'Rivo Trigger Key',
            name: 'trigger',
            component: 'text',
            description: 'Must match the rule’s trigger exactly',
          },
          {
            label: 'Icon',
            name: 'image',
            component: 'image',
          },
        ],
        defaultItem: {
          trigger: 'order_placed',
        },
        defaultValue: [],
      },
      {
        label: 'Labels',
        name: 'labels',
        component: 'group',
        description: 'Completed badge and empty state',
        fields: [
          {
            label: 'Completed Text',
            name: 'completedText',
            component: 'text',
            defaultValue: 'Completed',
          },
          {
            label: 'Empty Message',
            name: 'emptyMessage',
            component: 'text',
            defaultValue:
              'Ways to earn will appear here once the program is configured.',
          },
        ],
        defaultValue: {
          completedText: 'Completed',
          emptyMessage:
            'Ways to earn will appear here once the program is configured.',
        },
      },
      {
        label: 'Section Settings',
        name: 'section',
        component: 'group',
        description: 'Above the fold, grid columns, text color, full width',
        fields: [
          {
            label: 'Above The Fold',
            name: 'aboveTheFold',
            component: 'toggle',
            description: 'Sets the heading as H1',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
          {
            label: 'Grid Columns',
            name: 'gridColumns',
            component: 'select',
            options: [
              {label: '2', value: '2'},
              {label: '3', value: '3'},
              {label: '4', value: '4'},
            ],
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
          aboveTheFold: false,
          gridColumns: '4',
          textColor: COLOR_SCHEMA_DEFAULT_VALUE.text,
          fullWidth: false,
        },
      },
      containerSettings(),
    ],
  };
}
