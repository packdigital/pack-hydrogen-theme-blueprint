import {BUTTONS, COLORS} from '~/settings/common';
import {containerSettings} from '~/settings/container';

export function Schema() {
  return {
    category: 'Text',
    label: 'Text Block',
    key: 'text-block',
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/text-block-preview.jpg?v=1675730349',
    fields: [
      {
        label: 'Heading',
        name: 'heading',
        component: 'text',
        defaultValue: 'Text Block Heading',
      },
      {
        label: 'Subtext',
        name: 'subtext',
        component: 'markdown',
        defaultValue:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      },
      {
        label: 'Buttons',
        name: 'buttons',
        component: 'group-list',
        description: 'Max of two buttons',
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
          link: {text: 'Shop Now', url: ''},
          style: 'btn-primary',
        },
        defaultValue: [
          {
            link: {text: 'Shop Now', url: ''},
            style: 'btn-primary',
          },
        ],
      },
      {
        label: 'Section Settings',
        name: 'section',
        component: 'group',
        description: 'Above the fold, text color, icon color, full width',
        fields: [
          {
            label: 'Above The Fold',
            name: 'aboveTheFold',
            component: 'toggle',
            description: `Sets the heading as H1`,
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
          {
            label: 'Text Color',
            name: 'textColor',
            component: 'select',
            options: COLORS,
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
          textColor: 'var(--text)',
          fullWidth: false,
        },
      },
      containerSettings(),
    ],
  };
}
