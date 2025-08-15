import {SECTION_FRAGMENT} from './settings';

export const BLOG_PAGE_QUERY = `
  query Blog($handle: String!, $version: Version, $cursor: String, $articlesCursor: String, $language: String, $country: String) @inContext(language: $language, country: $country) {
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
      sections(first: 25, after: $cursor) {
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
      articles(first: 25, after: $articlesCursor) {
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
