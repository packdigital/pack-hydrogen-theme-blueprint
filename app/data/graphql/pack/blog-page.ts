import {SECTION_FRAGMENT} from './settings';

export const BLOG_PAGE_QUERY = `
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
          ...SectionFragment
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

export const CMS_BLOGS_QUERY = `
  query GetBackpackCmsBlogPages($first: Int, $cursor: String) {
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
