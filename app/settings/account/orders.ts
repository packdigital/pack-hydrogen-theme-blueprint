import {BUTTONS} from '~/settings/common';
import type {LinkCms} from '~/lib/types';

export interface OrdersSettings {
  ordersPerPage: number;
  emptyOrdersText: string;
  emptyOrdersButton: LinkCms;
  buttonStyle: string;
}

export default {
  label: 'Orders',
  name: 'orders',
  component: 'group',
  fields: [
    {
      label: 'Orders Per Page',
      name: 'ordersPerPage',
      component: 'number',
    },
    {
      label: 'Empty Orders Text',
      name: 'emptyOrdersText',
      component: 'text',
    },
    {
      label: 'Empty Orders Button',
      name: 'emptyOrdersButton',
      component: 'link',
    },
    {
      label: 'Button Style',
      name: 'buttonStyle',
      component: 'select',
      options: BUTTONS,
    },
  ],
  defaultValue: {
    ordersPerPage: 10,
    emptyOrdersText: `You don't have any orders yet`,
    emptyOrdersButton: {
      text: 'Start Shopping',
      url: '/',
    },
    buttonStyle: 'btn-primary',
  },
};
