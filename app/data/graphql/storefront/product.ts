import {PRODUCT_METAFIELDS_IDENTIFIERS} from '~/lib/constants';
import {getMetafieldsQueryString} from '~/lib/utils';

import {
  SELLING_PLAN_ALLOCATION_FRAGMENT,
  SELLING_PLAN_GROUP_FRAGMENT,
} from './sellingPlans';

// Docs: https://shopify.dev/docs/api/storefront/latest/queries/product

export const OPTION_FRAGMENT = `#graphql
  fragment OptionFragment on ProductOption {
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
`;

export const VARIANT_FRAGMENT = `#graphql
  fragment VariantFragment on ProductVariant {
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
      nodes {
        ... on SellingPlanAllocation {
          ...SellingPlanAllocationFragment
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
  fragment ProductFragment on Product {
    id
    title
    handle
    vendor
    description
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
          alt
          embedUrl
          host
          id
          mediaContentType
          previewImage {
            altText
            height
            id
            url
            width
          }
        }
        ... on Model3d {
          id
          alt
          mediaContentType
          sources {
            filesize
            format
            mimeType
            url
          }
          previewImage {
            altText
            height
            id
            url
            width
          }
        }
      }
    }
    ${getMetafieldsQueryString(PRODUCT_METAFIELDS_IDENTIFIERS)}
    options {
      ...OptionFragment
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
      ... on ProductVariant {
          ...VariantFragment
        }
    }
    sellingPlanGroups(first: 10) {
      nodes {
        ... on SellingPlanGroup {
          ...SellingPlanGroupFragment
        }
      }
    }
    variants(first: 250) {
      nodes {
        ... on ProductVariant {
          ...VariantFragment
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
  ${OPTION_FRAGMENT}
` as const;

export const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment ProductItemFragment on Product {
    id
    title
    handle
    vendor
    description
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
    ${getMetafieldsQueryString(PRODUCT_METAFIELDS_IDENTIFIERS)}
    options {
      ...OptionFragment
    }
    sellingPlanGroups(first: 10) {
      nodes {
        ... on SellingPlanGroup {
          ...SellingPlanGroupFragment
        }
      }
    }
    variants(first: 100) {
      nodes {
        ... on ProductVariant {
            ...VariantFragment
          }
      }
    }
  }
  ${VARIANT_FRAGMENT}
  ${SELLING_PLAN_GROUP_FRAGMENT}
  ${OPTION_FRAGMENT}
` as const;

export const PRODUCT_QUERY = `#graphql
  query Product(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ... on Product {
        ...ProductFragment
      }
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

export const PRODUCT_ITEM_QUERY = `#graphql
  query ProductItem(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ... on Product {
        ...ProductItemFragment
      }
    }
  }
  ${PRODUCT_ITEM_FRAGMENT}
` as const;

export const PRODUCT_OPTIONS_QUERY = `#graphql
  query ProductOptions(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      options {
        ...OptionFragment
      }
    }
  }
  ${OPTION_FRAGMENT}
` as const;

// Docs: https://shopify.dev/docs/api/storefront/latest/queries/products

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
          ...ProductItemFragment
        }
      }
    }
  }
  ${PRODUCT_ITEM_FRAGMENT}
` as const;

export const PRODUCT_FEED_QUERY = `#graphql
  query ProductsFeed(
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
          ...ProductItemFragment
        }
      }
    }
  }
  ${PRODUCT_ITEM_FRAGMENT}
` as const;

// Docs: https://shopify.dev/docs/api/storefront/latest/queries/productRecommendations

export const PRODUCT_RECOMMENDATIONS_QUERY = `#graphql
  query ProductRecommendations(
      $productId: ID!
      $intent: ProductRecommendationIntent
      $country: CountryCode
      $language: LanguageCode
    ) @inContext(country: $country, language: $language) {
      productRecommendations(productId: $productId, intent: $intent) {
        ... on Product {
          ...ProductItemFragment
        }
    }
  }
  ${PRODUCT_ITEM_FRAGMENT}
` as const;
