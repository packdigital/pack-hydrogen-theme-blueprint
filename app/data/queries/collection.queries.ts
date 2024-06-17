import {SECTION_FRAGMENT} from './pack.queries';
import {PRODUCT_ITEM_FRAGMENT} from './product.queries';

/*
 * BACKPACK API QUERIES -------------------------------------------------------
 */

export const COLLECTION_PAGE_QUERY = `#graphql
  query CollectionPage($handle: String!, $version: Version) {
    collectionPage: collectionPageByHandle(handle: $handle, version: $version) {
      id
      title
      handle
      status
      sections(first: 25) {
        nodes {
          ...section
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
      seo {
        title
        description
        image
        keywords
        noFollow
        noIndex
      }
      template {
        id
        title
        type
        status
        publishedAt
        createdAt
        updatedAt
      }
      publishedAt
      createdAt
      updatedAt
    }
  }
  ${SECTION_FRAGMENT}
` as const;

export const CMS_COLLECTIONS_QUERY = `#graphql
  query GetBackpackCmsCollectionPages($first: Int, $cursor: String) {
    collectionPages(first: $first, after: $cursor, version: PUBLISHED) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        handle
        seo {
          noIndex
        }
      }
    }
  }
` as const;

/*
 * STOREFRONT API QUERIES ----------------------------------------------------------
 */

// Docs: https://shopify.dev/docs/api/storefront/latest/queries/collection

const COLLECTION_FRAGMENT = `#graphql
  fragment collectionFragment on Collection {
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
        }
      }
      nodes {
        ... on Product {
          ...productItemFragment
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
  query CollectionDetails(
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
        ...collectionFragment
      }
    }
  }
  ${COLLECTION_FRAGMENT}
` as const;

export const COLLECTION_FILTERS_QUERY = `#graphql
  query CollectionDetails(
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
