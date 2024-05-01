const ADDRESS_SUMMARY = `#graphql
  fragment AddressSummary on MailingAddress {
    id
  }
`;

const MONEY = `#graphql
  fragment Money on MoneyV2 {
    amount
    currencyCode
  }
`;

const DISCOUNT_APPLICATION = `#graphql
  fragment DiscountApplication on DiscountApplication {
    allocationMethod
    targetSelection
    targetType
    value {
      ... on MoneyV2 {
        amount
        currencyCode
      }
      ... on PricingPercentageValue {
        percentage
      }
    }
  }
`;

const ADDRESS_FULL = `#graphql
  fragment AddressFull on MailingAddress {
    address1
    address2
    city
    company
    country
    countryCodeV2
    firstName
    formattedArea
    id
    lastName
    latitude
    longitude
    name
    phone
    province
    provinceCode
    zip
  }
`;

const IMAGE = `#graphql
  fragment Image on Image {
    altText
    height
    url
    id
    width
  }
`;

const SELLING_PLAN_ALLOCATION = `#graphql
  fragment SellingPlanAllocation on SellingPlanAllocation {
    priceAdjustments {
      compareAtPrice {
        ...Money
      }
      price {
        ...Money
      }
      perDeliveryPrice {
        ...Money
      }
      unitPrice {
        ...Money
      }
    }
  }
`;

const VARIANT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      ...Money
    }
    currentlyNotInStock
    id
    image {
      ...Image
    }
    price {
      ...Money
    }
    product {
      handle
      id
      title
      tags
    }
    sellingPlanAllocations(first: 10) {
      edges {
        node {
          ...SellingPlanAllocation
        }
      }
    }
    requiresShipping
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      ...Money
    }
    unitPriceMeasurement {
      measuredType
      quantityUnit
      quantityValue
    }
    weight
    weightUnit
  }
  ${IMAGE}
  ${SELLING_PLAN_ALLOCATION}
`;

const lineItemFull = `#graphql
  fragment LineItemFull on OrderLineItem {
    title
    quantity
    discountAllocations {
      allocatedAmount {
        ...Money
      }
      discountApplication {
        ...DiscountApplication
      }
    }
    originalTotalPrice {
      ...Money
    }
    discountedTotalPrice {
      ...Money
    }
    variant {
      ...ProductVariant
    }
  }
  ${VARIANT}
`;

const ORDER_SUMMARY = `#graphql
  fragment OrderSummary on Order {
    id
    name
    orderNumber
    statusUrl
    canceledAt
    cancelReason
    currencyCode
    processedAt
    financialStatus
    fulfillmentStatus
    totalPrice {
      ...Money
    }
    subtotalPrice {
      ...Money
    }
    lineItems(first: 100) {
      edges {
        node {
          title
        }
      }
    }
  }
  ${MONEY}
`;

const ORDER_FULL = `#graphql
  fragment OrderFull on Order {
    id
    name
    orderNumber
    statusUrl
    canceledAt
    cancelReason
    currencyCode
    processedAt
    email
    phone
    financialStatus
    fulfillmentStatus
    customerLocale
    currentSubtotalPrice {
      ...Money
    }
    currentTotalTax {
      ...Money
    }
    currentTotalPrice {
      ...Money
    }
    currentTotalDuties {
      ...Money
    }
    totalTax {
      ...Money
    }
    totalRefunded {
      ...Money
    }
    totalPrice {
      ...Money
    }
    subtotalPrice {
      ...Money
    }
    totalShippingPrice {
      ...Money
    }
    shippingAddress {
      ...AddressFull
    }
    successfulFulfillments(first: 100) {
      trackingCompany
      trackingInfo(first: 100) {
        url
      }
    }
    discountApplications(first: 100) {
      edges {
        node {
          ...DiscountApplication
        }
      }
    }
    lineItems(first: 100) {
      edges {
        node {
          ...LineItemFull
        }
      }
    }
  }
  ${MONEY}
  ${ADDRESS_FULL}
  ${DISCOUNT_APPLICATION}
  ${lineItemFull}
`;

const METAFIELD = `#graphql
  fragment Metafield on Metafield {
    namespace
    key
    value
    parentResource
    createdAt
    updatedAt
  }
`;

const CUSTOMER_SUMMARY = `#graphql
  fragment CustomerSummary on Customer {
    acceptsMarketing
    createdAt
    defaultAddress {
      ...AddressFull
    }
    displayName
    email
    firstName
    id
    lastIncompleteCheckout {
      id
      webUrl
      updatedAt
    }
    lastName
    phone
    tags
    updatedAt
  }
  ${ADDRESS_FULL}
`;

const CUSTOMER_FULL = `#graphql
  fragment CustomerFull on Customer {
    acceptsMarketing
    addresses(first: 50) {
      edges {
        node {
          ...AddressFull
        }
      }
    }
    createdAt
    defaultAddress {
      ...AddressFull
    }
    displayName
    email
    firstName
    id
    lastIncompleteCheckout {
      id
      webUrl
      updatedAt
    }
    lastName
    numberOfOrders
    orders(first: 100) {
      edges {
        node {
          id
          totalPrice {
            amount
          }
        }
      }
    }
    phone
    tags
    updatedAt
  }
  ${ADDRESS_FULL}
`;

const CUSTOMER_ADDRESSES = `#graphql
  fragment Customer on Customer {
    addresses(first: 50) {
      edges {
        node {
          ...AddressSummary
        }
      }
    }
  }
  ${ADDRESS_SUMMARY}
`;

const CUSTOMER_ORDERS = `#graphql
  fragment Customer on Customer {
    orders(first: 10) {
      edges {
        node {
          ...OrderSummary
        }
      }
    }
    phone
    tags
    updatedAt
  }
  ${ORDER_SUMMARY}
`;

const CUSTOMER_ERROR = `#graphql
  fragment CustomerUserError on CustomerUserError {
    code
    field
    message
  }
`;

const ERROR = `#graphql
  fragment UserError on UserError {
    field
    message
  }
`;

const CUSTOMER_ACCESS_TOKEN = `#graphql
  fragment CustomerAccessToken on CustomerAccessToken {
    accessToken
    expiresAt
  }
`;

export const fragments = {
  ADDRESS_SUMMARY,
  ADDRESS_FULL,
  ORDER_FULL,
  ORDER_SUMMARY,
  CUSTOMER_ORDERS,
  CUSTOMER_ADDRESSES,
  METAFIELD,
  CUSTOMER_FULL,
  CUSTOMER_SUMMARY,
  CUSTOMER_ERROR,
  ERROR,
  CUSTOMER_ACCESS_TOKEN,
};
