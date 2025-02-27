// Docs: https://shopify.dev/docs/api/storefront/latest/objects/Shop

export const LAYOUT_QUERY = `#graphql
  query Layout {
    shop {
      id
      name
      description
      brand {
        logo {
          image {
            url
          }
        }
      }
    }
  }
` as const;

const COUNTRY_FRAGMENT = `#graphql
  fragment CountryFragment on Country {
    currency {
      isoCode
      name
      symbol
    }
    isoCode
    name
    unitSystem
  }
` as const;

const POLICY_FRAGMENT = `#graphql
  fragment PolicyFragment on ShopPolicy {
    handle
    id
    title
    body
    __typename
  }
` as const;

export const SHOP_QUERY = `#graphql
  query Shop($country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
    shop {
      description
      moneyFormat
      name
      paymentSettings {
        acceptedCardBrands
        cardVaultUrl
        countryCode
        currencyCode
        enabledPresentmentCurrencies
        supportedDigitalWallets
        shopifyPaymentsAccountId
      }
      primaryDomain {
        host
        sslEnabled
        url
      }
      privacyPolicy {
        ...PolicyFragment
      }
      refundPolicy {
        ...PolicyFragment
      }
      shippingPolicy {
        ...PolicyFragment
      }
      shipsToCountries
      termsOfService {
        ...PolicyFragment
      }
    }
  }
  ${POLICY_FRAGMENT}
` as const;

// Docs: https://shopify.dev/docs/api/storefront/latest/queries/localization

export const LOCALIZATION_QUERY = `#graphql
  query Localization($country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
    shop {
      paymentSettings {
        enabledCurrencies: enabledPresentmentCurrencies
      }
    }
    localization {
      availableCountries {
        ...CountryFragment
      }
      country {
        ...CountryFragment
      }
    }
  }
  ${COUNTRY_FRAGMENT}
` as const;
