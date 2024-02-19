export interface AnalyticsSettings {
  enabled: boolean;
}

export default {
  label: 'Analytics',
  name: 'analytics',
  component: 'group',
  description: 'Enable Shopify analytics',
  fields: [
    {
      label: 'Enabled',
      name: 'enabled',
      component: 'toggle',
      description: 'Ensure "PUBLIC_SHOPIFY_SHOP_ID" is set as an env var',
      toggleLabels: {
        true: 'On',
        false: 'Off',
      },
      defaultValue: true,
    },
  ],
};
