import {SECTION_FRAGMENT} from './pack.queries';

/*
 * BACKPACK API QUERIES -------------------------------------------------------
 */

export const BLOG_QUERY = `#graphql
  query Blog($first: Int!, $handle: String!, $version: Version, $cursor: String) {
    blog: blogByHandle(handle: $handle, version: $version) {
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
      sections(first: 25) {
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
      articles(first: $first, after: $cursor) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            id
            title
            handle
            description
            status
            author
            category
            tags
            excerpt
            seo {
              title
              description
              image
              keywords
              noFollow
              noIndex
            }
            firstPublishedAt
            publishedAt
            createdAt
            updatedAt
          }
        }
    }
  }
  ${SECTION_FRAGMENT}
` as const;

export const CMS_BLOGS_QUERY = `#graphql
  query GetBackpackCmsCollectionPages($first: Int, $cursor: String) {
    blogs(first: $first, after: $cursor, version: PUBLISHED) {
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
