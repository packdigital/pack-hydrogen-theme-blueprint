import {COLORS} from '~/settings/common';
import {containerSettings} from '~/settings/container';

export function Schema() {
  return {
    category: 'Text',
    label: 'Icon Row',
    key: 'icon-row',
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/icon-row-preview.jpg?v=1675730317',
    fields: [
      {
        label: 'Heading',
        name: 'heading',
        component: 'text',
        defaultValue: 'Icon Row Heading',
      },
      {
        label: 'Subtext',
        name: 'subtext',
        component: 'markdown',
        defaultValue:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      },
      {
        label: 'Icons',
        name: 'icons',
        component: 'group-list',
        itemProps: {
          label: '{{item.label}}',
        },
        fields: [
          {
            label: 'Icon',
            name: 'icon',
            component: 'select',
            description: `Custom hardcoded list of svg's in the codebase`,
            options: [
              {label: 'None', value: 'none'},
              {label: 'Shipping', value: 'shipping'},
              {label: 'Customer Service', value: 'customer-service'},
              {label: 'Warranty', value: 'warranty'},
              {label: 'Innovation', value: 'innovation'},
            ],
          },
          {
            label: 'Image',
            name: 'image',
            component: 'image',
            description:
              'Manual upload of icon, overriding any selected icon. Recommended image/svg size under 50kb',
          },
          {
            label: 'Image Alt',
            name: 'alt',
            component: 'text',
            description:
              'Alt text set in media manager for selected image(s) will take priority. Re-add image(s) if alt text was set in media manager after selection.',
          },
          {
            label: 'Label',
            name: 'label',
            component: 'text',
          },
        ],
        defaultValue: [
          {icon: 'shipping', label: 'Free Shipping'},
          {icon: 'customer-service', label: 'Top Customer Service'},
          {icon: 'warranty', label: 'Lifetime Warranty'},
          {icon: 'innovation', label: 'Innovative Designs'},
        ],
        defaultItem: {icon: 'shipping', label: 'New Icon'},
      },
      {
        label: 'Section Settings',
        name: 'section',
        component: 'group',
        description: 'Text color, icon color, full width',
        fields: [
          {
            label: 'Text Color',
            name: 'textColor',
            component: 'select',
            options: COLORS,
          },
          {
            label: 'Icon Color',
            name: 'iconColor',
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
          bgColor: 'var(--off-white)',
          textColor: 'var(--text)',
          iconColor: 'var(--primary)',
          fullWidth: false,
        },
      },
      containerSettings(),
    ],
  };
}
