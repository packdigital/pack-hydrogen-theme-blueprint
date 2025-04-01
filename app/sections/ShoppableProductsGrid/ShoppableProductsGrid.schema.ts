import {containerSettings} from '~/settings/container';
import {TEXT_ALIGN} from '~/settings/common';

export function Schema({template}: {template: string}) {
  if (template !== 'page') return null;

  return {
    category: 'Product',
    label: 'Shoppable Products Grid',
    key: 'shoppable-products-grid',
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0822/0439/3780/files/products-grid-preview.jpg?v=1721419119',
    fields: [
      {
        label: 'Heading',
        name: 'heading',
        component: 'text',
        defaultValue: 'Shop Our Products',
      },
      {
        label: 'Heading Alignment',
        name: 'headingTextAlign',
        component: 'radio-group',
        direction: 'horizontal',
        variant: 'radio',
        options: TEXT_ALIGN.mobile,
        defaultValue: 'text-center',
      },
      {
        label: 'Products',
        name: 'products',
        component: 'group-list',
        description:
          'If the selected product does display in the frontend, check it is on the Hydrogen sales channel.',
        itemProps: {
          label: '{{item.product.handle}}',
        },
        fields: [
          {
            name: 'product',
            component: 'productSearch',
            label: 'Product',
          },
        ],
        defaultValue: [],
      },
      {
        label: 'Grid Settings',
        name: 'grid',
        component: 'group',
        description: 'Columns',
        fields: [
          {
            label: 'Columns (desktop)',
            name: 'columnsDesktop',
            component: 'select',
            options: [
              {label: '1', value: 'lg:grid-cols-1'},
              {label: '2', value: 'lg:grid-cols-2'},
              {label: '3', value: 'lg:grid-cols-3'},
              {label: '4', value: 'lg:grid-cols-4'},
              {label: '5', value: 'lg:grid-cols-5'},
            ],
          },
          {
            label: 'Columns (tablet)',
            name: 'columnsTablet',
            component: 'select',
            options: [
              {label: '1', value: 'md:grid-cols-1'},
              {label: '2', value: 'md:grid-cols-2'},
              {label: '3', value: 'md:grid-cols-3'},
              {label: '4', value: 'md:grid-cols-4'},
            ],
          },
          {
            label: 'Columns (mobile)',
            name: 'columnsMobile',
            component: 'select',
            options: [
              {label: '1', value: 'grid-cols-1'},
              {label: '2', value: 'grid-cols-2'},
              {label: '3', value: 'grid-cols-3'},
            ],
          },
        ],
        defaultValue: {
          columnsDesktop: 'lg:grid-cols-4',
          columnsTablet: 'md:grid-cols-3',
          columnsMobile: 'grid-cols-2',
        },
      },
      {
        label: 'Product Item Settings',
        name: 'productItem',
        component: 'group',
        description: 'Star rating',
        fields: [
          {
            label: 'Enable Star Rating',
            name: 'enabledStarRating',
            component: 'toggle',
            description:
              'For the actual star rating, API logic must be first implemented in the ProductStars component. Otherwise the manual rating set in site settings will be displayed',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
        ],
        defaultValue: {
          enabledStarRating: true,
        },
      },
      containerSettings(),
    ],
  };
}
