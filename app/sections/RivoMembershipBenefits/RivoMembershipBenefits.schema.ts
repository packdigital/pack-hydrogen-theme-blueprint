import {
  COLOR_PICKER_DEFAULTS,
  COLOR_SCHEMA_DEFAULT_VALUE,
} from '~/settings/common';
import {containerSettings} from '~/settings/container';

export function Schema() {
  return {
    category: 'Loyalty',
    label: 'Rivo Membership Benefits',
    key: 'rivo-membership-benefits',
    fields: [
      {
        label: 'Eyebrow',
        name: 'eyebrow',
        component: 'text',
      },
      {
        label: 'Heading',
        name: 'heading',
        component: 'text',
        defaultValue: 'Membership benefits',
      },
      {
        label: 'Subtext',
        name: 'subtext',
        component: 'text',
      },
      {
        label: 'Tier Content',
        name: 'tiers',
        component: 'group-list',
        description:
          'Optional. Tier names and benefits come from Rivo admin — this only adds a tagline and image, matched by tier name',
        itemProps: {
          label: '{{item.name}}',
        },
        fields: [
          {
            label: 'Rivo Tier Name',
            name: 'name',
            component: 'text',
            description: 'Must match the tier name in Rivo exactly',
          },
          {
            label: 'Tagline',
            name: 'tagline',
            component: 'text',
          },
          {
            label: 'Image',
            name: 'image',
            component: 'image',
          },
        ],
        defaultItem: {name: 'Member'},
      },
      {
        label: 'Labels',
        name: 'labels',
        component: 'group',
        description: 'Empty state',
        fields: [
          {
            label: 'Empty Message',
            name: 'emptyMessage',
            component: 'text',
            defaultValue:
              'Membership tiers will appear here once they are configured in Rivo.',
          },
        ],
        defaultValue: {
          emptyMessage:
            'Membership tiers will appear here once they are configured in Rivo.',
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
            description: 'Renders the heading as an h1 instead of an h2',
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
          gridColumns: '3',
          textColor: COLOR_SCHEMA_DEFAULT_VALUE.text,
          fullWidth: false,
        },
      },
      containerSettings(),
    ],
  };
}
