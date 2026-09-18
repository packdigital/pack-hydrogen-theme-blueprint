import {
  COLOR_PICKER_DEFAULTS,
  COLOR_SCHEMA_DEFAULT_VALUE,
} from '~/settings/common';
import {containerSettings} from '~/settings/container';

export function Schema() {
  return {
    category: 'Loyalty',
    label: 'Rivo Tier Benefits',
    key: 'rivo-tier-benefits',
    fields: [
      {
        label: 'Eyebrow',
        name: 'eyebrow',
        component: 'text',
        defaultValue: 'More rewards, more benefits',
      },
      {
        label: 'Heading',
        name: 'heading',
        component: 'text',
        defaultValue: 'Tiers & benefits',
      },
      {
        label: 'Subtext',
        name: 'subtext',
        component: 'text',
        defaultValue:
          'Level up your tier to unlock more points and exclusive perks.',
      },
      {
        label: 'Tier Content',
        name: 'tiers',
        component: 'group-list',
        description:
          'Tier names and thresholds come from Rivo. Add copy here by matching the Rivo tier name exactly. Tiers not in Rivo are ignored.',
        itemProps: {
          label: '{{item.name}}',
        },
        fields: [
          {
            label: 'Rivo Tier Name',
            name: 'name',
            component: 'text',
            description: 'Must match the tier name in Rivo, e.g. Silver',
          },
          {
            label: 'Tagline',
            name: 'tagline',
            component: 'text',
          },
          {
            label: 'Threshold Label',
            name: 'thresholdLabel',
            component: 'text',
            description:
              'Overrides the automatic "500+ points" label, e.g. "Spend $100"',
          },
          {
            label: 'Perks',
            name: 'perks',
            component: 'group-list',
            description:
              'Only used when the tier has no perks configured in Rivo',
            itemProps: {
              label: '{{item.text}}',
            },
            fields: [
              {
                label: 'Perk',
                name: 'text',
                component: 'text',
              },
            ],
            defaultItem: {text: 'Earn 2 points per $1'},
            defaultValue: [],
          },
          {
            label: 'Comparison Values',
            name: 'benefits',
            component: 'group-list',
            description:
              'One per matrix row. Match the row label; use "true" for a checkmark.',
            itemProps: {
              label: '{{item.label}}',
            },
            fields: [
              {
                label: 'Row Label',
                name: 'label',
                component: 'text',
              },
              {
                label: 'Value',
                name: 'value',
                component: 'text',
                description: '"true" renders a checkmark; blank renders a dash',
              },
            ],
            defaultItem: {label: 'Points per $1', value: '1'},
            defaultValue: [],
          },
        ],
        defaultItem: {
          name: 'Bronze',
          tagline: 'Start earning on every order.',
        },
        defaultValue: [],
      },
      {
        label: 'Comparison Rows',
        name: 'matrix',
        component: 'group-list',
        description:
          'Row labels for the comparison table, in order. Rivo has no benefit-matrix model, so these are authored here.',
        itemProps: {
          label: '{{item.label}}',
        },
        fields: [
          {
            label: 'Row Label',
            name: 'label',
            component: 'text',
          },
        ],
        defaultItem: {label: 'Points per $1'},
        defaultValue: [],
      },
      {
        label: 'Labels',
        name: 'labels',
        component: 'group',
        fields: [
          {
            label: 'Current Tier Text',
            name: 'currentTierText',
            component: 'text',
            defaultValue: 'Your current tier',
          },
          {
            label: 'Free Tier Label',
            name: 'freeTierLabel',
            component: 'text',
            description: 'Used for a tier with a 0 threshold',
            defaultValue: 'Free to join',
          },
          {
            label: 'Matrix Heading',
            name: 'matrixHeading',
            component: 'text',
            defaultValue: 'Benefits',
          },
          {
            label: 'Included Text',
            name: 'includedText',
            component: 'text',
            description: 'Screen-reader label for the checkmark',
            defaultValue: 'Included',
          },
          {
            label: 'Empty Message',
            name: 'emptyMessage',
            component: 'text',
            defaultValue:
              'VIP tiers will appear here once they are configured in Rivo.',
          },
        ],
        defaultValue: {
          currentTierText: 'Your current tier',
          freeTierLabel: 'Free to join',
          matrixHeading: 'Benefits',
          includedText: 'Included',
          emptyMessage:
            'VIP tiers will appear here once they are configured in Rivo.',
        },
      },
      {
        label: 'Section Settings',
        name: 'section',
        component: 'group',
        description: 'Above the fold, comparison table, text color, full width',
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
            label: 'Show Comparison Table',
            name: 'showMatrix',
            component: 'toggle',
            description: 'Requires Comparison Rows to be set',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
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
          showMatrix: true,
          textColor: COLOR_SCHEMA_DEFAULT_VALUE.text,
          fullWidth: false,
        },
      },
      containerSettings(),
    ],
  };
}
