import {SECTION_FRAGMENT} from './settings';

export const COLLECTION_PAGE_QUERY = `
  query CollectionPage($handle: String!, $version: Version) {
    collectionPage: collectionPageByHandle(handle: $handle, version: $version) {
      id
      handle
      status
      sections(first: 25) {
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

export const CMS_COLLECTION_QUERY = `
  query CmsCollectionPage($handle: String!, $version: Version) {
    collectionPage: collectionPageByHandle(handle: $handle, version: $version) {
      seo {
        noIndex
      }
    }
  }
` as const;
