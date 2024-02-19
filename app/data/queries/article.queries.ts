import {SECTION_FRAGMENT} from './pack.queries';

/*
 * BACKPACK API QUERIES -------------------------------------------------------
 */

export const ARTICLE_QUERY = `#graphql
  query Article($handle: String!, $version: Version, $cursor: String) {
    article: articleByHandle(handle: $handle, version: $version) {
      id
      title
      handle
      description
      status
      author
      category
      tags
      excerpt
      bodyHtml
      seo {
        title
        description
        image
        keywords
        noFollow
        noIndex
      }
      blog {
        handle
        title
        description
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
      firstPublishedAt
      publishedAt
      createdAt
      updatedAt
    }
  }
  ${SECTION_FRAGMENT}
` as const;

export const CMS_ARTICLES_QUERY = `#graphql
  query GetBackpackCmsCollectionPages($first: Int, $cursor: String) {
    articles(first: $first, after: $cursor, version: PUBLISHED) {
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
