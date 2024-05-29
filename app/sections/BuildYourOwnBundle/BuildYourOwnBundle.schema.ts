import {containerSettings} from '~/settings/container';

export function Schema({template}: {template: string}) {
  if (template !== 'page') return null;

  return {
    category: 'Bundles',
    label: 'Build Your Own Bundle',
    key: 'build-your-own-bundle',
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0629/5519/2520/files/byob-preview.jpg?v=1715879706',
    fields: [
      {
        label: 'Product Groupings',
        name: 'productGroupings',
        component: 'group-list',
        description:
          'If there are no product groupings, add one grouping here to control all products. Grouping subnav will be hidden if only one grouping',
        itemProps: {
          label: '{{item.name}}',
        },
        fields: [
          {
            label: 'Name',
            name: 'name',
            component: 'text',
            defaultValue: 'Product Grouping',
            validate: {
              required: true,
            },
          },
          {
            label: 'Subnav Name',
            name: 'subnavName',
            component: 'text',
            defaultValue: 'Product Grouping',
            validate: {
              required: true,
            },
          },
          {
            label: 'Products',
            name: 'products',
            component: 'group-list',
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
          },
        ],
        defaultValue: [{name: 'Primary', subnavName: 'Primary', products: []}],
      },
      {
        label: 'Tiers',
        name: 'tiers',
        description: `Every tier is equal to one (1) product addition to the bundle regardless if addition doesn't unlock a different discount.\n\nImportant: These settings should mirror the discount logic set in Shopify. This section is only the visual layer to add products to the cart and does not control the actual discount`,
        component: 'group-list',
        itemProps: {
          label: `{{item.heading}}`,
        },
        defaultItem: {
          heading: 'Continue your bundle',
          message: 'Add Another',
          type: 'none',
        },
        fields: [
          {
            label: 'Tier Heading ',
            name: 'heading',
            component: 'text',
            description: `Heading replaces latest heading in the summary, after tier is met`,
          },
          {
            label: 'Progress Visualizer Message',
            name: 'message',
            component: 'text',
            description: `Message associated with tier in the summary's progress visualizer, before tier is met`,
          },
          {
            label: 'Discount Type',
            name: 'type',
            component: 'radio-group',
            direction: 'horizontal',
            variant: 'radio',
            description: `None: no discount yet associated with tier\n\nPercent: tier has a percent off discount applied to the selected bundle (set percent below)\n\nBuyXGetYFree: tier applies a 100% discount to the cheapest product in the selected bundle\n\nNOTE: the latest tier met is the only discount applied to the bundle. Tiers do not stack their discounts`,
            options: [
              {label: 'None', value: 'none'},
              {label: 'Percent', value: 'percent'},
              {label: 'BuyXGetYFree', value: 'buyXGetYFree'},
            ],
          },
          {
            label: 'Tier Discount Percent Off',
            name: 'percent',
            component: 'number',
            description: 'Only applicable if discount type is Percent',
          },
        ],
        defaultValue: [
          {
            heading: `Customize your bundle`,
            message: 'Start Building Your Bundle',
            type: 'none',
          },
          {
            heading: `You're saving 5%`,
            message: 'Add Your Second',
            type: 'percent',
            percent: 5,
          },
          {
            heading: `You're saving 10%`,
            message: 'Add Your Third',
            type: 'percent',
            percent: 10,
          },
          {
            heading: `You've unlocked a FREE item!`,
            message: 'Unlock Free Item!',
            type: 'buyXGetYFree',
          },
        ],
      },
      {
        label: 'Summary Heading Default',
        name: 'defaultHeading',
        component: 'text',
        description: 'Bundle summary heading before any tier is met',
        defaultValue: 'Custmoize your bundle',
      },
      {
        component: 'group-list',
        name: 'preselects',
        label: 'Preselected Products',
        itemProps: {
          label: '{{item.product.handle}}',
        },
        description:
          'Only products part of a product grouping will be preselected, using the first variant',
        fields: [
          {
            label: 'Product',
            name: 'product',
            component: 'productSearch',
          },
        ],
      },
      containerSettings(),
    ],
  };
}
