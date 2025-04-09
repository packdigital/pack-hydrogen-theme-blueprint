import {ADMIN_PRODUCTS_METAFIELDS_QUERY_STRING} from '~/lib/utils';

import {ADMIN_SELLING_PLAN_FRAGMENT} from './sellingPlans';

// Docs: https://shopify.dev/docs/api/admin-graphql/latest/queries/productByHandle

export const ADMIN_OPTION_FRAGMENT = `
  fragment AdminOptionFragment on ProductOption {
    id
    name
    optionValues {
      id
      name
      swatch {
        color
        image {
          mediaContentType
          preview {
            image {
              ...AdminImageFragment
            }
          }
          id
          alt
        }
      }
    }
  }
`;

export const ADMIN_IMAGE_FRAGMENT = `
  fragment AdminImageFragment on Image {
    altText
    height
    id
    url
    width
  }
`;

export const ADMIN_VARIANT_FRAGMENT = `
  fragment AdminVariantFragment on ProductVariant {
    id
    title
    availableForSale
    sku
    image {
      ...AdminImageFragment
    }
    price
    sellingPlanAllocations: sellingPlanGroups(first: 1) {
      nodes {
        productsCount {
          count
          precision
        }
        sellingPlans(first: 1) {
          nodes {
            ... on SellingPlan {
              ...AdminSellingPlanFragment
            }
          }
        }
      }
    }
    compareAtPrice
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
` as const;

export const ADMIN_PRODUCT_FRAGMENT = `
  fragment AdminProductFragment on Product {
    id
    title
    handle
    status
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
    featuredImage: featuredMedia {
      preview {
        image {
          ...AdminImageFragment
        }
      }
    }
    priceRange: priceRangeV2 {
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
        preview {
          image {
            ...AdminImageFragment
          }
        }
        ... on Video {
          mediaContentType
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
          preview {
            image {
              ...AdminImageFragment
            }
          }
        }
        ... on Model3d {
          id
          alt
          sources {
            filesize
            format
            mimeType
            url
          }
          preview {
            image {
              ...AdminImageFragment
            }
          }
        }
      }
    }
    ${ADMIN_PRODUCTS_METAFIELDS_QUERY_STRING}
    options(first: 250) {
      ...AdminOptionFragment
    }
    sellingPlanGroups(first: 1) {
      nodes {
        id
        name
        appId
        options
        sellingPlans(first: 1) {
          nodes {
            ... on SellingPlan {
              ...AdminSellingPlanFragment
            }
          }
        }
      }
    }
    variants(first: 250) {
      nodes {
        ... on ProductVariant {
          ...AdminVariantFragment
        }
      }
    }
    seo {
      description
      title
    }
  }
  ${ADMIN_IMAGE_FRAGMENT}
  ${ADMIN_VARIANT_FRAGMENT}
  ${ADMIN_OPTION_FRAGMENT}
  ${ADMIN_SELLING_PLAN_FRAGMENT}
  ` as const;

export const ADMIN_PRODUCT_ITEM_FRAGMENT = `
  fragment AdminProductItemFragment on Product {
    id
    title
    handle
    status
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
    featuredMedia {
      preview {
        image {
          ...AdminImageFragment
        }
      }
    }
    priceRangeV2 {
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
        preview {
          image {
            ...AdminImageFragment
          }
        }
        ... on Video {
          mediaContentType
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
          preview {
            image {
              ...AdminImageFragment
            }
          }
        }
        ... on Model3d {
          id
          alt
          sources {
            filesize
            format
            mimeType
            url
          }
          preview {
            image {
              ...AdminImageFragment
            }
          }
        }
      }
    }
    ${ADMIN_PRODUCTS_METAFIELDS_QUERY_STRING}
    options(first: 50) {
      ...AdminOptionFragment
    }
    sellingPlanGroups(first: 1) {
      nodes {
        id
        name
        appId
        options
        sellingPlans(first: 1) {
          nodes {
            ... on SellingPlan {
              ...AdminSellingPlanFragment
            }
          }
        }
      }
    }
    variants(first: 100) {
      nodes {
        ... on ProductVariant {
          ...AdminVariantFragment
        }
      }
    }
  }
  ${ADMIN_IMAGE_FRAGMENT}
  ${ADMIN_VARIANT_FRAGMENT}
  ${ADMIN_OPTION_FRAGMENT}
  ${ADMIN_SELLING_PLAN_FRAGMENT}
  ` as const;

export const ADMIN_PRODUCT_QUERY = `
  query AdminProduct(
    $handle: String!
  ) {
    productByIdentifier(identifier: {handle: $handle}) {
      ...AdminProductFragment
    }
  }
  ${ADMIN_PRODUCT_FRAGMENT}
` as const;

export const ADMIN_PRODUCT_ITEM_QUERY = `
  query AdminProductItem(
    $handle: String!
  ) {
    productByIdentifier(identifier: {handle: $handle}) {
      ...AdminProductItemFragment
    }
  }
  ${ADMIN_PRODUCT_ITEM_FRAGMENT}
` as const;

export const ADMIN_PRODUCT_ITEM_BY_ID_QUERY = `
  query AdminProductItemById(
    $id: ID!
  ) {
    productByIdentifier(identifier: {id: $id}) {
      ...AdminProductItemFragment
    }
  }
  ${ADMIN_PRODUCT_ITEM_FRAGMENT}
` as const;
