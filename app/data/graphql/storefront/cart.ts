import {OPTION_FRAGMENT} from './product';

// Docs: https://shopify.dev/docs/api/storefront/latest/objects/Cart

export const CART_LINE_FRAGMENT = `#graphql
  fragment CartLineFragment on CartLine {
    id
    quantity
    cost {
      amountPerQuantity {
        amount
        currencyCode
      }
      compareAtAmountPerQuantity {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
      subtotalAmount {
        amount
        currencyCode
      }
    }
    attributes {
      key
      value
    }
    discountAllocations {
      discountedAmount {
        amount
        currencyCode
      }
      ... on CartAutomaticDiscountAllocation {
        __typename
        discountedAmount {
          amount
          currencyCode
        }
        title
      }
      ... on CartCodeDiscountAllocation {
        __typename
        code
        discountedAmount {
          amount
          currencyCode
        }
      }
      ... on CartCustomDiscountAllocation {
        __typename
        discountedAmount {
          amount
          currencyCode
        }
        title
      }
    }
    merchandise {
      ... on ProductVariant {
        availableForSale
        id
        sku
        title
        compareAtPrice {
          amount
          currencyCode
        }
        image {
          altText
          height
          id
          url
          width
        }
        price {
          amount
          currencyCode
        }
        product {
          handle
          id
          productType
          tags
          title
          vendor
          collections(first: 10) {
            nodes {
              handle
            }
          }
          options {
            ...OptionFragment
          }
          images(first: 20) {
            nodes {
              altText
              height
              id
              url
              width
            }
          }
        }
        selectedOptions {
          name
          value
        }
      }
    }
  }
` as const;

export const CART_LINE_COMPONENT_FRAGMENT = `#graphql
  fragment CartLineComponentFragment on ComponentizableCartLine {
    id
    quantity
    cost {
      amountPerQuantity {
        amount
        currencyCode
      }
      compareAtAmountPerQuantity {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
      subtotalAmount {
        amount
        currencyCode
      }
    }
    attributes {
      key
      value
    }
    discountAllocations {
      discountedAmount {
        amount
        currencyCode
      }
      ... on CartAutomaticDiscountAllocation {
        __typename
        discountedAmount {
          amount
          currencyCode
        }
        title
      }
      ... on CartCodeDiscountAllocation {
        __typename
        code
        discountedAmount {
          amount
          currencyCode
        }
      }
      ... on CartCustomDiscountAllocation {
        __typename
        discountedAmount {
          amount
          currencyCode
        }
        title
      }
    }
    merchandise {
      ... on ProductVariant {
        availableForSale
        id
        sku
        title
        compareAtPrice {
          amount
          currencyCode
        }
        image {
          altText
          height
          id
          url
          width
        }
        price {
          amount
          currencyCode
        }
        product {
          handle
          id
          productType
          tags
          title
          vendor
          collections(first: 10) {
            nodes {
              handle
            }
          }
          options {
            id
            name
            optionValues {
              id
              name
              swatch {
                color
                image {
                  mediaContentType
                  previewImage {
                    height
                    id
                    url
                    width
                    altText
                  }
                  id
                  alt
                }
              }
            }
          }
          images(first: 20) {
            nodes {
              altText
              height
              id
              url
              width
            }
          }
        }
        selectedOptions {
          name
          value
        }
      }
    }
    lineComponents {
      id
      quantity
      cost {
        amountPerQuantity {
          amount
          currencyCode
        }
        compareAtAmountPerQuantity {
          amount
          currencyCode
        }
        totalAmount {
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
      }
      attributes {
        key
        value
      }
      discountAllocations {
        discountedAmount {
          amount
          currencyCode
        }
        ... on CartAutomaticDiscountAllocation {
          __typename
          discountedAmount {
            amount
            currencyCode
          }
          title
        }
        ... on CartCodeDiscountAllocation {
          __typename
          code
          discountedAmount {
            amount
            currencyCode
          }
        }
        ... on CartCustomDiscountAllocation {
          __typename
          discountedAmount {
            amount
            currencyCode
          }
          title
        }
      }
      merchandise {
        ... on ProductVariant {
          availableForSale
          id
          sku
          title
          compareAtPrice {
            amount
            currencyCode
          }
          image {
            altText
            height
            id
            url
            width
          }
          price {
            amount
            currencyCode
          }
          product {
            handle
            id
            productType
            tags
            title
            vendor
            collections(first: 10) {
              nodes {
                handle
              }
            }
            options {
              ...OptionFragment
            }
            images(first: 20) {
              nodes {
                altText
                height
                id
                url
                width
              }
            }
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
` as const;

export const CART_FRAGMENT = `#graphql
  fragment CartFragment on Cart {
    id
    checkoutUrl
    createdAt
    totalQuantity
    note
    updatedAt
    __typename
    buyerIdentity {
      countryCode
      customer {
        id
        email
        firstName
        lastName
        displayName
      }
      email
      phone
    }
    attributes {
      key
      value
    }
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
    discountAllocations {
      discountedAmount {
        amount
        currencyCode
      }
      ... on CartAutomaticDiscountAllocation {
        __typename
        discountedAmount {
          amount
          currencyCode
        }
        title
      }
      ... on CartCodeDiscountAllocation {
        __typename
        code
        discountedAmount {
          amount
          currencyCode
        }
      }
      ... on CartCustomDiscountAllocation {
        __typename
        discountedAmount {
          amount
          currencyCode
        }
        title
      }
    }
    discountCodes {
      applicable
      code
    }
    lines(first: $numCartLines) {
      edges {
        node {
          ...CartLineComponentFragment
        }
      }
      edges {
        node {
          ...CartLineFragment
        }
      }
    }
  }
  ${CART_LINE_FRAGMENT}
  ${CART_LINE_COMPONENT_FRAGMENT}
  ${OPTION_FRAGMENT}
` as const;
