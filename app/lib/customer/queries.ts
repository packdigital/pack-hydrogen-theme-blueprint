import {fragments} from './fragments';

/*
  Queries ——————————————————————————————————————————————————————————————————————————————————————————
*/
const ADDRESSES_QUERY = `#graphql
  query getAddresses($country: CountryCode, $customerAccessToken: String!, $language: LanguageCode)
   @inContext(country: $country, language: $language)  {
    customer(customerAccessToken: $customerAccessToken) {
      addresses(first: 100) {
        edges {
          node {
            ...AddressFull
          }
        }
      }
    }
  }
  ${fragments.ADDRESS_FULL}
`;

const CUSTOMER_QUERY = `#graphql
  query getCustomer($country: CountryCode, $customerAccessToken: String!, $language: LanguageCode)
   @inContext(country: $country, language: $language)  {
    customer(customerAccessToken: $customerAccessToken) {
      ...CustomerFull
    }
  }
  ${fragments.CUSTOMER_FULL}
`;

const METAFIELD_QUERY = `#graphql
  query getMetafield($country: CountryCode, $customerAccessToken: String!, $namespace: String!, $key: String!, $language: LanguageCode)
   @inContext(country: $country, language: $language)  {
    customer(customerAccessToken: $customerAccessToken) {
      id
      metafield(namespace: $namespace, key: $key){
        ...Metafield
      }
    }
  }
  ${fragments.metafield}
`;

const ORDER_QUERY = `#graphql
  query getOrderById($country: CountryCode, $id: ID!, $language: LanguageCode)
   @inContext(country: $country, language: $language)  {
    order: node(id: $id) {
      ...OrderFull
    }
  }
  ${fragments.ORDER_FULL}
`;

const ORDERS_NEXT_QUERY = `#graphql
  query getOrdersNext($country: CountryCode, $customerAccessToken: String!, $first: Int!, $after: String, $language: LanguageCode)
   @inContext(country: $country, language: $language)  {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: $first, after: $after, reverse: true) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        page: edges {
          cursor
          order: node {
            ...OrderSummary
          }
        }
      }
    }
  }
  ${fragments.ORDER_SUMMARY}
`;

const ORDERS_PREVIOUS_QUERY = `#graphql
  query getOrdersPrevious($country: CountryCode, $customerAccessToken: String!, $last: Int!, $before: String, $language: LanguageCode)
   @inContext(country: $country, language: $language)  {
    customer(customerAccessToken: $customerAccessToken) {
      orders(last: $last, before: $before, reverse: true) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        page: edges {
          cursor
          order: node {
            ...OrderSummary
          }
        }
      }
    }
  }
  ${fragments.ORDER_SUMMARY}
`;

export const queries = {
  ADDRESSES_QUERY,
  CUSTOMER_QUERY,
  METAFIELD_QUERY,
  ORDER_QUERY,
  ORDERS_NEXT_QUERY,
  ORDERS_PREVIOUS_QUERY,
};
