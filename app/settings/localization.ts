export interface LocalizationSettings {
  enabled: boolean;
}

export default {
  label: 'Localization',
  name: 'localization',
  component: 'group',
  description: 'Enable Shopify localization',
  fields: [
    {
      label: 'Country Selector Enabled',
      name: 'enabled',
      description: `Shows list of all countries available for shipping within Shopify Markets.\n\nSelecting a country that isn't default will prefix the url path with the locale; doing so will localize product prices if the country's currency is enabled in Shopify payments.`,
      component: 'toggle',
      toggleLabels: {
        true: 'On',
        false: 'Off',
      },
      defaultValue: true,
    },
  ],
};
