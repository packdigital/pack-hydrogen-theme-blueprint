export interface ShippingCutoffSettings {
  enabled: boolean;
  timezone: string;
  hideForInternational: boolean;
  placements: {
    pdp: boolean;
    cartLine: boolean;
    cartTotals: boolean;
  };
  cutoffs: {
    label: string;
    date: string;
    time: string;
    message: string;
  }[];
  afterLastCutoffMessage: string;
}

export default {
  label: 'Shipping Cutoffs',
  name: 'shippingCutoff',
  component: 'group',
  description:
    'Order-by deadlines (e.g. holiday delivery) shown below add to cart, on cart lines and above checkout',
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
      label: 'Warehouse Timezone',
      name: 'timezone',
      component: 'text',
      description:
        'IANA timezone the cutoff times are in, e.g. America/New_York, America/Denver, America/Los_Angeles. Shoppers see the same deadline wherever they are.',
    },
    {
      label: 'Hide For International',
      name: 'hideForInternational',
      component: 'toggle',
      description: 'Hide messages on non-default markets',
      toggleLabels: {
        true: 'On',
        false: 'Off',
      },
    },
    {
      label: 'Placements',
      name: 'placements',
      component: 'group',
      description: 'Where the message renders',
      fields: [
        {
          label: 'Product Page (Below Add To Cart)',
          name: 'pdp',
          component: 'toggle',
          toggleLabels: {true: 'On', false: 'Off'},
        },
        {
          label: 'Cart Line Items',
          name: 'cartLine',
          component: 'toggle',
          toggleLabels: {true: 'On', false: 'Off'},
        },
        {
          label: 'Cart (Above Checkout)',
          name: 'cartTotals',
          component: 'toggle',
          toggleLabels: {true: 'On', false: 'Off'},
        },
      ],
      defaultValue: {
        pdp: true,
        cartLine: false,
        cartTotals: true,
      },
    },
    {
      label: 'Cutoffs',
      name: 'cutoffs',
      component: 'group-list',
      description:
        'The earliest cutoff that has not passed is shown. Add one per shipping method, in any order.',
      itemProps: {
        label: '{{item.label}}',
      },
      fields: [
        {
          label: 'Label',
          name: 'label',
          component: 'text',
          description: 'Internal name, e.g. Standard, Express',
        },
        {
          label: 'Order By Date',
          name: 'date',
          component: 'text',
          description: 'YYYY-MM-DD, e.g. 2026-12-15',
        },
        {
          label: 'Order By Time',
          name: 'time',
          component: 'text',
          description: '24-hour HH:MM in the warehouse timezone, e.g. 12:00',
        },
        {
          label: 'Message',
          name: 'message',
          component: 'text',
          description:
            'Use {{date}} for the order-by date and {{countdown}} for the time remaining (e.g. 4h 23m)',
        },
      ],
      defaultItem: {
        label: 'Standard',
        date: '2026-12-15',
        time: '12:00',
        message: 'Order by {{date}} for delivery by Dec 24',
      },
      defaultValue: [
        {
          label: 'Standard',
          date: '2026-12-15',
          time: '12:00',
          message: 'Order by {{date}} for delivery by Dec 24',
        },
        {
          label: 'Express',
          date: '2026-12-21',
          time: '12:00',
          message:
            'Order within {{countdown}} with express shipping for delivery by Dec 24',
        },
      ],
    },
    {
      label: 'After Last Cutoff Message',
      name: 'afterLastCutoffMessage',
      component: 'text',
      description:
        'Shown once every cutoff has passed. Leave blank to hide the message.',
    },
  ],
  defaultValue: {
    enabled: false,
    timezone: 'America/New_York',
    hideForInternational: true,
    placements: {
      pdp: true,
      cartLine: false,
      cartTotals: true,
    },
    cutoffs: [
      {
        label: 'Standard',
        date: '2026-12-15',
        time: '12:00',
        message: 'Order by {{date}} for delivery by Dec 24',
      },
      {
        label: 'Express',
        date: '2026-12-21',
        time: '12:00',
        message:
          'Order within {{countdown}} with express shipping for delivery by Dec 24',
      },
    ],
    afterLastCutoffMessage: '',
  },
};
