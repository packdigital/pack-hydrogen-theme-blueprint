/**
 * Rivo publishes its program config as shop metafields, which is what its Liquid
 * theme blocks read. There is no equivalent on the Merchant REST API, so this is
 * the only way a headless storefront can see any of it.
 *
 * Both namespaces are queried because Rivo is mid-migration: newer stores carry
 * `rivo_settings.*` and older ones only the legacy `ba_*`. `rivo-init.liquid`
 * resolves them in exactly this order, and `normalizeRivoProgramConfig` mirrors
 * that preference.
 */
export const SHOP_RIVO_CONFIG_QUERY = `#graphql
  query ShopRivoConfig {
    shop {
      id
      currencyCode
      rivoSettingsLoy: metafield(namespace: "rivo_settings", key: "loy") {
        value
      }
      rivoSettingsGlobal: metafield(namespace: "rivo_settings", key: "global") {
        value
      }
      baLoyConfig: metafield(namespace: "ba_loy", key: "config") {
        value
      }
      baGlobalConfig: metafield(namespace: "ba_global", key: "config") {
        value
      }
    }
  }
` as const;
