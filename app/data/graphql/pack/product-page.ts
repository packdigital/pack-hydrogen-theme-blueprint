import {SECTION_FRAGMENT} from './settings';

export const PRODUCT_PAGE_QUERY = `
  query ProductPage($handle: String!, $version: Version, $cursor: String, $language: String, $country: String) @inContext(language: $language, country: $country) {
    productPage: productPageByHandle(handle: $handle, version: $version) {
      id
      title
      handle
      status
      sections(first: 25, after: $cursor) {
        nodes {
          ...SectionFragment
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

export const CMS_PRODUCT_QUERY = `
  query CmsProductPage($handle: String!, $version: Version) {
    productPage: productPageByHandle(handle: $handle, version: $version) {
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
` as const;
