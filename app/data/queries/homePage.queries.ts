import {SECTION_FRAGMENT} from './pack.queries';

/*
 * BACKPACK API QUERIES -------------------------------------------------------
 */

export const HOME_PAGE_QUERY = `#graphql
  query HomePage($version: Version, $cursor: String) {
    page: pageByHandle(handle: "/", version: $version) {
      id
      title
      handle
      description
      status
      seo {
        title
        description
        image
        keywords
        noFollow
        noIndex
      }
      sections(first: 25, after: $cursor) {
        nodes {
          ...section
        }
        pageInfo {
          hasNextPage
          endCursor
        }
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
