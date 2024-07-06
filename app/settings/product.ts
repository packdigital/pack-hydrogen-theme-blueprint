import type {Swatch} from '~/lib/types';

import {COLORS} from './common';

export interface ProductSettings {
  addToCart: {
    addToCartText: string;
    soldOutText: string;
    preorderText: string;
    subtext: string;
  };
  backInStock: {
    enabled: boolean;
    notifyMeText: string;
    heading: string;
    subtext: string;
    submitText: string;
    successText: string;
  };
  badges: {
    badgeColors: {
      tag: string;
      bgColor: string;
      textColor: string;
    }[];
  };
  colors: {
    swatchesGroups: {
      name: string;
      swatches: Swatch[];
    }[];
  };
  quantitySelector: {
    enabled: boolean;
  };
  reviews: {
    enabledStarRating: boolean;
  };
}

export default {
  label: 'Product',
  name: 'product',
  component: 'group',
  description:
    'Add to cart, back in stock, badges, color swatches, quantity selector, reviews',
  fields: [
    {
      label: 'Add To Cart',
      name: 'addToCart',
      component: 'group',
      description: 'Add to cart, sold out, presale text, subtext',
      fields: [
        {
          label: 'Add To Cart Text',
          name: 'addToCartText',
          component: 'text',
        },
        {
          label: 'Sold Out Text',
          name: 'soldOutText',
          component: 'text',
        },
        {
          label: 'Preorder Text',
          name: 'preorderText',
          component: 'text',
        },
        {
          label: 'Subtext',
          name: 'subtext',
          component: 'text',
          description: 'Text below the Add To Cart button',
        },
      ],
      defaultValue: {
        addToCartText: 'Add To Cart',
        soldOutText: 'Sold Out',
        preorderText: 'Preorder',
        subtext: '',
      },
    },
    {
      label: 'Back In Stock',
      name: 'backInStock',
      component: 'group',
      description: 'Enable notifications, notify me text, modal texts',
      fields: [
        {
          label: 'Enable Notifications',
          name: 'enabled',
          component: 'toggle',
          toggleLabels: {
            true: 'On',
            false: 'Off',
          },
        },
        {
          label: 'Notify Me Text',
          name: 'notifyMeText',
          component: 'text',
        },
        {
          label: 'Modal Heading',
          name: 'heading',
          component: 'text',
        },
        {
          label: 'Modal Subtext',
          name: 'subtext',
          component: 'text',
        },
        {
          label: 'Modal Submit Text',
          name: 'submitText',
          component: 'text',
        },
        {
          label: 'Modal Success Message',
          name: 'successText',
          component: 'text',
        },
      ],
      defaultValue: {
        enabled: false,
        notifyMeText: 'Notify Me When Available',
        heading: 'Notify Me When Available',
        subtext: `Enter your email below and we'll notify you when this product is back in stock.`,
        submitText: 'Submit',
        successText:
          'Thank you! We will notify you when this product is back in stock.',
      },
    },
    {
      label: 'Badges',
      name: 'badges',
      component: 'group',
      description: 'Badge colors',
      fields: [
        {
          label: 'Badge Colors',
          name: 'badgeColors',
          component: 'group-list',
          description:
            'Note: product badges are set up via Shopify tags using the format "badge::Some Value"',
          itemProps: {
            label: '{{item.tag}}',
          },
          fields: [
            {
              label: 'Tag Value',
              name: 'tag',
              component: 'text',
              description:
                'Letter casing must be same as tag value in Shopify, e.g. "New", "Sale"',
            },
            {
              label: 'Background Color',
              name: 'bgColor',
              component: 'select',
              options: COLORS,
            },
            {
              label: 'Text Color',
              name: 'textColor',
              component: 'select',
              options: COLORS,
            },
          ],
          defaultItem: {
            bgColor: 'var(--black)',
            textColor: 'var(--white)',
          },
          defaultValue: [
            {
              tag: 'Draft',
              bgColor: 'var(--mediumGray)',
              textColor: 'var(--white)',
            },
            {
              tag: 'Best Seller',
              bgColor: 'var(--black)',
              textColor: 'var(--white)',
            },
            {
              tag: 'New',
              bgColor: 'var(--secondary)',
              textColor: 'var(--white)',
            },
            {
              tag: 'Sale',
              bgColor: 'var(--primary)',
              textColor: 'var(--white)',
            },
          ],
        },
      ],
    },
    {
      label: 'Colors',
      name: 'colors',
      component: 'group',
      description: 'Color swatches',
      fields: [
        {
          label: 'Color Swatches Groups',
          name: 'swatchesGroups',
          component: 'group-list',
          itemProps: {
            label: '{{item.name}}',
          },
          defaultItem: {
            name: 'New Swatches Group',
          },
          description: 'Color names should be unique across all groups',
          fields: [
            {
              label: 'Group Name',
              name: 'name',
              component: 'text',
            },
            {
              label: 'Color Swatches',
              name: 'swatches',
              component: 'group-list',
              itemProps: {
                label: '{{item.name}}',
              },
              defaultItem: {
                name: 'New Color',
              },
              fields: [
                {
                  label: 'Color Name',
                  name: 'name',
                  component: 'text',
                },
                {
                  label: 'Color',
                  name: 'color',
                  component: 'color',
                },
                {
                  name: 'image',
                  label: 'Image',
                  component: 'image',
                  description:
                    'If provided, image will overlay the color.\nEnsure image is no more than 2KB in size',
                },
              ],
            },
          ],
          defaultValue: [
            {
              name: 'Primary Colors',
              swatches: [
                {
                  name: 'Black',
                  color: '#000000',
                },
                {
                  name: 'White',
                  color: '#FFFFFF',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      label: 'Quantity Selector',
      name: 'quantitySelector',
      component: 'group',
      description: 'Enable',
      fields: [
        {
          label: 'Enable Quantity Selector',
          name: 'enabled',
          component: 'toggle',
          toggleLabels: {
            true: 'On',
            false: 'Off',
          },
        },
      ],
      defaultValue: {
        enabled: false,
      },
    },
    {
      label: 'Reviews',
      name: 'reviews',
      component: 'group',
      description: 'Enable star rating',
      fields: [
        {
          label: 'Enable Star Rating',
          name: 'enabledStarRating',
          component: 'toggle',
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
  ],
};
