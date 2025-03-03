import type {MediaCms, LinkCms, ProductCms} from '~/lib/types';

import {COLOR_PICKER_DEFAULTS, COLOR_SCHEMA_DEFAULT_VALUE} from './common';

export interface HeaderSettings {
  promobar: {
    enabled: boolean;
    autohide: boolean;
    effect: string;
    delay: number;
    speed: number;
    bgColor: string;
    color: string;
    messages: {
      message: string;
      link: LinkCms;
    }[];
  };
  menu: {
    navItems: {
      navItem: LinkCms;
      links: {
        link: LinkCms;
      }[];
      mainLink: LinkCms;
      imageLinks: {
        alt: string;
        image: MediaCms;
        caption: string;
        link: LinkCms;
      }[];
    }[];
    logoPositionDesktop: string;
    productsSlider: {
      heading: string;
      products: {
        product: ProductCms;
      }[];
    };
    links: {
      link: LinkCms;
    }[];
    bgColor: string;
    textColor: string;
    iconColor: string;
    transparentNav: {
      pageHandles: string[];
      iconColor: string;
      isChangeColorsOnScroll: boolean;
      pixelOffsetChangeColors: number;
      scrolledBgColor: string;
      scrolledIconColor: string;
    };
  };
}

export default {
  label: 'Header',
  name: 'header',
  component: 'group',
  description: 'Nav, menu, promobar',
  fields: [
    {
      label: 'Nav & Menu',
      name: 'menu',
      component: 'group',
      description:
        'Nav items, logo position, products slider, links, background color, icon color, transparent nav',
      fields: [
        {
          label: 'Nav Items',
          name: 'navItems',
          component: 'group-list',
          itemProps: {
            label: '{{item.navItem.text}}',
          },
          fields: [
            {
              label: 'Nav Item',
              name: 'navItem',
              component: 'link',
            },
            {
              label: 'Menu Links',
              name: 'links',
              component: 'group-list',
              itemProps: {
                label: '{{item.link.text}}',
              },
              fields: [
                {
                  label: 'Link',
                  name: 'link',
                  component: 'link',
                },
              ],
            },
            {
              label: 'Menu Button',
              name: 'mainLink',
              component: 'link',
            },
            {
              label: 'Menu Images',
              name: 'imageLinks',
              component: 'group-list',
              itemProps: {
                label: '{{item.caption}}',
              },
              fields: [
                {
                  label: 'Image Alt',
                  name: 'alt',
                  component: 'text',
                  description:
                    'Alt text set in media manager for selected image(s) will take priority. Re-add image(s) if alt text was set in media manager after selection.',
                },
                {
                  label: 'Image',
                  name: 'image',
                  component: 'image',
                },
                {
                  label: 'Caption',
                  name: 'caption',
                  component: 'text',
                },
                {
                  label: 'Link',
                  name: 'link',
                  component: 'link',
                },
              ],
            },
          ],
          defaultItem: {
            navItem: {text: 'Shop', url: '/collections/all'},
          },
        },
        {
          label: 'Logo Position (desktop)',
          name: 'logoPositionDesktop',
          component: 'radio-group',
          direction: 'horizontal',
          variant: 'radio',
          options: [
            {label: 'Left', value: 'left'},
            {label: 'Center', value: 'center'},
          ],
        },
        {
          label: 'Products Slider',
          name: 'productsSlider',
          description: 'Visible only in menu drawer',
          component: 'group',
          fields: [
            {
              label: 'Heading',
              name: 'heading',
              component: 'text',
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
                  label: 'Product',
                  name: 'product',
                  component: 'productSearch',
                  description:
                    'If the selected product does display in the frontend, check it is on the Hydrogen sales channel.',
                },
              ],
            },
          ],
        },
        {
          label: 'Addtional Links',
          name: 'links',
          description: 'Visible only in menu drawer',
          component: 'group-list',
          itemProps: {
            label: '{{item.link.text}}',
          },
          fields: [
            {
              label: 'Link',
              name: 'link',
              component: 'link',
            },
          ],
        },
        {
          label: 'Navigation Background Color',
          name: 'bgColor',
          component: 'color',
          colors: COLOR_PICKER_DEFAULTS,
        },
        {
          label: 'Navigation Text Color',
          name: 'textColor',
          component: 'color',
          colors: COLOR_PICKER_DEFAULTS,
        },
        {
          label: 'Navigation Icon Color',
          name: 'iconColor',
          component: 'color',
          colors: COLOR_PICKER_DEFAULTS,
        },
        {
          label: 'Transparent Navigation',
          name: 'transparentNav',
          component: 'group',
          description: 'Set a transparent navigation on selected pages',
          fields: [
            {
              label: 'Page Handles',
              name: 'pageHandles',
              component: 'tags',
              description:
                'The navigation, except the logo and cart icon, will be transparent on these page handles. Applies only to page template types',
            },
            {
              label: 'Transparent Navigation Icon Color',
              name: 'iconColor',
              component: 'color',
              colors: COLOR_PICKER_DEFAULTS,
            },
            {
              label: 'Change Colors on Scroll',
              name: 'isChangeColorsOnScroll',
              component: 'toggle',
              toggleLabels: {
                true: 'On',
                false: 'Off',
              },
            },
            {
              label: 'Pixel Offset to Change Colors',
              name: 'pixelOffsetChangeColors',
              component: 'number',
            },
            {
              label: 'Scrolled Background Color',
              name: 'scrolledBgColor',
              component: 'color',
              colors: COLOR_PICKER_DEFAULTS,
            },
            {
              label: 'Scrolled Icon Color',
              name: 'scrolledIconColor',
              component: 'color',
              colors: COLOR_PICKER_DEFAULTS,
            },
          ],
          defaultValue: {
            iconColor: COLOR_SCHEMA_DEFAULT_VALUE.white,
            isChangeColorsOnScroll: true,
            pixelOffsetChangeColors: 100,
            scrolledIconColor: COLOR_SCHEMA_DEFAULT_VALUE.text,
          },
        },
      ],
      defaultValue: {
        logoPositionDesktop: 'left',
        bgColor: COLOR_SCHEMA_DEFAULT_VALUE.background,
        textColor: COLOR_SCHEMA_DEFAULT_VALUE.text,
        iconColor: COLOR_SCHEMA_DEFAULT_VALUE.text,
      },
    },
    {
      label: 'Promobar',
      name: 'promobar',
      component: 'group',
      description: 'Enable, messages, colors, slider settings',
      fields: [
        {
          label: 'Enabled',
          name: 'enabled',
          component: 'toggle',
          toggleLabels: {
            true: 'On',
            false: 'Off',
          },
        },
        {
          label: 'Autohide',
          name: 'autohide',
          component: 'toggle',
          description:
            'Hides promobar after scrolling away from top of the page',
          toggleLabels: {
            true: 'On',
            false: 'Off',
          },
        },
        {
          label: 'Effect Between Transitions',
          name: 'effect',
          component: 'select',
          description: 'Refresh page to observe change',
          options: [
            {label: 'Fade', value: 'fade'},
            {label: 'Horizontal Slide', value: 'slide-horizontal'},
            {label: 'Vertical Slide', value: 'slide-vertical'},
          ],
        },
        {
          label: 'Autoplay Delay',
          name: 'delay',
          component: 'number',
          description: 'Delay between transitions (in ms)',
        },
        {
          label: 'Speed',
          name: 'speed',
          component: 'number',
          description: 'Duration of transition between slides (in ms)',
        },
        {
          label: 'Background Color',
          name: 'bgColor',
          component: 'color',
          colors: COLOR_PICKER_DEFAULTS,
        },
        {
          label: 'Text Color',
          name: 'color',
          component: 'color',
          colors: COLOR_PICKER_DEFAULTS,
        },
        {
          label: 'Messages',
          name: 'messages',
          component: 'group-list',
          itemProps: {
            label: '{{item.message}}',
          },
          fields: [
            {
              label: 'Message',
              name: 'message',
              component: 'textarea',
            },
            {
              label: 'Link (optional)',
              name: 'link',
              component: 'link',
              description: 'Link wrapping entire message',
            },
          ],
          defaultItem: {
            message: 'Free shipping on orders over $100. Shop Now',
            link: {url: '/', text: ''},
          },
        },
      ],
      defaultValue: {
        enabled: true,
        effect: 'fade',
        delay: 5000,
        speed: 500,
        bgColor: COLOR_SCHEMA_DEFAULT_VALUE.primary,
        color: COLOR_SCHEMA_DEFAULT_VALUE.white,
      },
    },
  ],
};
