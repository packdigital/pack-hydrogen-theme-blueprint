const CUSTOMER_FRAGMENT = `
  fragment OrderCard on Order {
    id
    name
    number
    processedAt
    financialStatus
    fulfillments(first: 1) {
      nodes {
        status
      }
    }
    totalPrice {
      amount
      currencyCode
    }
    lineItems(first: 250) {
      edges {
        node {
          title
          image {
            altText
            height
            url
            width
          }
        }
      }
    }
  }
  fragment AddressPartial on CustomerAddress {
    id
    formatted
    firstName
    lastName
    company
    address1
    address2
    territoryCode
    zoneCode
    city
    zip
    phoneNumber
  }
  fragment CustomerDetails on Customer {
    id
    firstName
    lastName
    creationDate
    phoneNumber {
      phoneNumber
    }
    emailAddress {
      emailAddress
    }
    defaultAddress {
      ...AddressPartial
    }
    addresses(first: 6) {
      edges {
        node {
          ...AddressPartial
        }
      }
    }
    orders(first: 250, sortKey: PROCESSED_AT, reverse: true) {
      edges {
        node {
          ...OrderCard
        }
      }
    }
    metafield(namespace: "sparklayer", key: "authentication") {
      value
      type
      key
      namespace
    }
    tags
  }
` as const;

// Docs: https://shopify.dev/docs/api/customer/latest/queries/customer
export const CUSTOMER_DETAILS_QUERY = `
  query CustomerDetails {
    customer {
      ...CustomerDetails
    }
  }
  ${CUSTOMER_FRAGMENT}
` as const;

// Docs: https://shopify.dev/docs/api/customer/latest/queries/order
export const CUSTOMER_ORDER_QUERY = `
  fragment OrderMoney on MoneyV2 {
    amount
    currencyCode
  }
  fragment DiscountApplication on DiscountApplication {
    value {
      __typename
      ... on MoneyV2 {
        ...OrderMoney
      }
      ... on PricingPercentageValue {
        percentage
      }
    }
  }
  fragment OrderLineItemFull on LineItem {
    id
    title
    quantity
    productId
    price {
      ...OrderMoney
    }
    discountAllocations {
      allocatedAmount {
        ...OrderMoney
      }
      discountApplication {
        ...DiscountApplication
      }
    }
    totalDiscount {
      ...OrderMoney
    }
    image {
      altText
      height
      url
      id
      width
    }
    variantTitle
  }
  fragment Order on Order {
    id
    name
    statusPageUrl
    processedAt
    financialStatus
    fulfillments(first: 250) {
      nodes {
        status
      }
    }
    totalTax {
      ...OrderMoney
    }
    totalPrice {
      ...OrderMoney
    }
    totalShipping {
      ...OrderMoney
    }
    totalRefunded {
      ...OrderMoney
    }
    totalTax {
      ...OrderMoney
    }
    subtotal {
      ...OrderMoney
    }
    shippingAddress {
      name
      formatted(withName: true)
      formattedArea
    }
    discountApplications(first: 100) {
      nodes {
        ...DiscountApplication
      }
    }
    lineItems(first: 100) {
      nodes {
        ...OrderLineItemFull
      }
    }
  }
  query Order($orderId: ID!) {
    order(id: $orderId) {
      ... on Order {
        ...Order
      }
    }
  }
` as const;

export const CUSTOMER_UPDATE_MUTATION = `
mutation customerUpdate($customer: CustomerUpdateInput!) {
  customerUpdate(input: $customer) {
    userErrors {
      code
      field
      message
    }
  }
}
`;

// Docs: https://shopify.dev/docs/api/customer/latest/mutations/customerAddressUpdate
export const UPDATE_ADDRESS_MUTATION = `
  mutation customerAddressUpdate(
    $address: CustomerAddressInput!
    $addressId: ID!
    $defaultAddress: Boolean
 ) {
    customerAddressUpdate(
      address: $address
      addressId: $addressId
      defaultAddress: $defaultAddress
    ) {
      customerAddress {
        id
      }
      userErrors {
        code
        field
        message
      }
    }
  }
` as const;

// Docs: https://shopify.dev/docs/api/customer/latest/mutations/customerAddressDelete
export const DELETE_ADDRESS_MUTATION = `
  mutation customerAddressDelete(
    $addressId: ID!,
  ) {
    customerAddressDelete(addressId: $addressId) {
      deletedAddressId
      userErrors {
        code
        field
        message
      }
    }
  }
` as const;

// Docs: https://shopify.dev/docs/api/customer/latest/mutations/customerAddressCreate
export const CREATE_ADDRESS_MUTATION = `
  mutation customerAddressCreate(
    $address: CustomerAddressInput!
    $defaultAddress: Boolean
  ) {
    customerAddressCreate(
      address: $address
      defaultAddress: $defaultAddress
    ) {
      customerAddress {
        id
      }
      userErrors {
        code
        field
        message
      }
    }
  }
` as const;

// Docs: https://shopify.dev/docs/api/customer/latest/objects/Customer
export const CUSTOMER_LOCATIONS_QUERY = `
  query CustomerLocations {
    customer {
      id
      emailAddress {
        emailAddress
      }
      companyContacts(first: 1){
        edges{
          node{
            company{
              id
              name
              locations(first: 10){
                edges{
                  node{
                    id
                    name
                    shippingAddress {
                      countryCode
                      formattedAddress
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
` as const;
