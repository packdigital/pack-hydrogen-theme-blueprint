import {SECTION_FRAGMENT} from './pack.queries';
import {
  SELLING_PLAN_ALLOCATION_FRAGMENT,
  SELLING_PLAN_GROUP_FRAGMENT,
} from './sellingPlans.queries';

/*
 * BACKPACK API QUERIES -------------------------------------------------------
 */

export const PRODUCT_PAGE_QUERY = `#graphql
  query ProductPage($handle: String!, $version: Version) {
    productPage: productPageByHandle(handle: $handle, version: $version) {
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

export const CMS_PRODUCTS_QUERY = `#graphql
  query GetBackpackCmsProductPages($first: Int, $cursor: String) {
    productPages(first: $first, after: $cursor, version: PUBLISHED) {
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
        sourceProduct {
          data {
            status
          }
        }
      }
    }
  }
` as const;

/*
 * STOREFRONT API QUERIES -----------------------------------------------------
 */

// Docs: https://shopify.dev/docs/api/storefront/latest/queries/product

export const METAFIELD_FRAGMENT = `#graphql
fragment metafield on Metafield {
    createdAt
    description
    id
    key
    namespace
    type
    updatedAt
    value
  }
`;

export const VARIANT_FRAGMENT = `#graphql
  fragment variantFragment on ProductVariant {
    id
    title
    availableForSale
    sku
    weight
    weightUnit
    image {
      altText
      height
      id
      url
      width
    }
    price {
      currencyCode
      amount
    }
    sellingPlanAllocations(first: 10) {
      edges {
        node {
          ... on SellingPlanAllocation {
            ...sellingPlanAllocation
          }
        }
      }
    }
    compareAtPrice {
      currencyCode
      amount
    }
    selectedOptions {
      name
      value
    }
    product {
      handle
      id
      productType
      title
      tags
    }
  }
  ${SELLING_PLAN_ALLOCATION_FRAGMENT}
` as const;

export const PRODUCT_FRAGMENT = `#graphql
  fragment productFragment on Product {
    id
    title
    handle
    vendor
    descriptionHtml
    productType
    publishedAt
    tags
    collections(first: 250) {
      nodes {
        handle
      }
    }
    featuredImage {
      altText
      height
      id
      url
      width
    }
    priceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
      minVariantPrice {
        amount
        currencyCode
      }
    }
    media(first: 250) {
      nodes {
        alt
        id
        mediaContentType
        previewImage {
          altText
          height
          id
          url
          width
          }
        ... on Video {
          sources {
            height
            url
            width
            mimeType
          }
        }
        ... on ExternalVideo {
          originUrl
        }
        ... on Model3d {
          sources {
            mimeType
            url
          }
        }
      }
    }
    options {
      name
      values
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
      ... on ProductVariant {
          ...variantFragment
        }
    }
    sellingPlanGroups(first: 10) {
      edges {
        node {
          ... on SellingPlanGroup {
            ...sellingPlanGroup
          }
        }
      }
    }
    variants(first: 250) {
      nodes {
        ... on ProductVariant {
          ...variantFragment
        }
      }
    }
    seo {
      description
      title
    }
  }
  ${VARIANT_FRAGMENT}
  ${SELLING_PLAN_GROUP_FRAGMENT}
` as const;

export const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment productItemFragment on Product {
    id
    title
    handle
    vendor
    productType
    createdAt
    publishedAt
    tags
    collections(first: 10) {
      nodes {
        handle
      }
    }
    featuredImage {
      altText
      height
      id
      url
      width
    }
    priceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
      minVariantPrice {
        amount
        currencyCode
      }
    }
    media(first: 10) {
      nodes {
        alt
        id
        mediaContentType
        previewImage {
          altText
          height
          id
          url
          width
        }
        ... on Video {
          sources {
            height
            url
            width
            mimeType
          }
        }
      }
    }
    options {
      values
      name
    }
    sellingPlanGroups(first: 10) {
      edges {
        node {
          ... on SellingPlanGroup {
            ...sellingPlanGroup
          }
        }
      }
    }
    variants(first: 100) {
      nodes {
        ... on ProductVariant {
            ...variantFragment
          }
      }
    }
  }
  ${VARIANT_FRAGMENT}
  ${SELLING_PLAN_GROUP_FRAGMENT}
` as const;

export const PRODUCT_QUERY = `#graphql
  query product(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ... on Product {
        ...productFragment
      }
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

export const PRODUCT_ITEM_QUERY = `#graphql
  query product(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ... on Product {
        ...productItemFragment
      }
    }
  }
  ${PRODUCT_ITEM_FRAGMENT}
` as const;

export const PRODUCT_METAFIELDS_QUERY = `#graphql
  query product(
    $handle: String!
    $key: String!
    $namespace: String
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      metafields(identifiers: {key: $key, namespace: $namespace}) {
        ...metafield
      }
    }
  }
  ${METAFIELD_FRAGMENT}
` as const;

export const GROUPING_PRODUCT_QUERY = `#graphql
  query product(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      handle
      productType
      options {
        name,
        values
      }
      variants(first: 100) {
        nodes {
          id
          title
          availableForSale
          sku
          image {
            altText
            height
            id
            url
            width
          }
          price {
            currencyCode
            amount
          }
          compareAtPrice {
            currencyCode
            amount
          }
          selectedOptions {
            name
            value
          }
          product {
            handle
            id
          }
        }
      }
    }
  }
` as const;

export const PRODUCTS_QUERY = `#graphql
  query Products(
    $query: String
    $first: Int
    $reverse: Boolean
    $country: CountryCode
    $language: LanguageCode
    $sortKey: ProductSortKeys
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, sortKey: $sortKey, reverse: $reverse, query: $query, after: $endCursor) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      nodes {
        ... on Product {
          ...productItemFragment
        }
      }
    }
  }
  ${PRODUCT_ITEM_FRAGMENT}
` as const;

export const PRODUCT_FEED_QUERY = `#graphql
  query Products(
    $first: Int!
    $cursor: String
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: $first, after: $cursor) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ... on Product {
          ...productItemFragment
        }
      }
    }
  }
  ${PRODUCT_ITEM_FRAGMENT}
` as const;

export const PRODUCT_RECOMMENDATIONS_QUERY = `#graphql
  query productRecommendations(
      $productId: ID!
      $intent: ProductRecommendationIntent
      $country: CountryCode
      $language: LanguageCode
    ) @inContext(country: $country, language: $language) {
      productRecommendations(productId: $productId, intent: $intent) {
        ... on Product {
          ...productItemFragment
        }
    }
  }
  ${PRODUCT_ITEM_FRAGMENT}
` as const;
