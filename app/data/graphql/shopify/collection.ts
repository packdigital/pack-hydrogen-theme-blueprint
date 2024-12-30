import {PRODUCT_ITEM_FRAGMENT} from './product';

// Docs: https://shopify.dev/docs/api/storefront/latest/queries/collection

export const COLLECTION_FRAGMENT = `#graphql
  fragment CollectionFragment on Collection {
    id
    title
    description
    handle
    image {
      altText
      height
      id
      url
      width
    }
    products(
      sortKey: $sortKey,
      reverse: $reverse,
      filters: $filters,
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      pageInfo {
        hasPreviousPage
        hasNextPage
        endCursor
        startCursor
      }
      filters {
        id
        label
        type
        values {
          id
          label
          count
          input
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
      nodes {
        ... on Product {
          ...ProductItemFragment
        }
      }
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_ITEM_FRAGMENT}
` as const;

export const COLLECTION_QUERY = `#graphql
  query Collection(
    $handle: String!,
    $country: CountryCode,
    $language: LanguageCode
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $filters: [ProductFilter!]
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      ... on Collection {
        ...CollectionFragment
      }
    }
  }
  ${COLLECTION_FRAGMENT}
` as const;

export const COLLECTION_FILTERS_QUERY = `#graphql
  query CollectionFilters(
    $handle: String!,
    $country: CountryCode,
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      products(first: 1) {
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
      }
    }
  }
` as const;
