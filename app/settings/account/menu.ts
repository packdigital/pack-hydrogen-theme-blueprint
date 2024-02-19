import type {LinkCms} from '~/lib/types';

export interface MenuSettings {
  menuItems: {
    link: LinkCms;
  }[];
  helpHeading: string;
  helpItems: {
    link: LinkCms;
  }[];
}

export default {
  label: 'Account Menu',
  name: 'menu',
  component: 'group',
  fields: [
    {
      label: 'Menu items',
      name: 'menuItems',
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
      defaultItem: {
        link: {text: 'New Menu Item', url: ''},
      },
      defaultValue: [
        {link: {text: 'Orders', url: '/account/orders'}},
        {link: {text: 'Addresses', url: '/account/addresses'}},
        {link: {text: 'Profile', url: '/account/profile'}},
      ],
    },
    {
      label: 'Help Heading',
      name: 'helpHeading',
      component: 'text',
      defaultValue: 'Need Help?',
    },
    {
      label: 'Help Items',
      name: 'helpItems',
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
      defaultValue: [
        {
          link: {
            text: 'support@storefront.com',
            url: 'mailto:support@storefront.com',
          },
        },
      ],
    },
  ],
};
