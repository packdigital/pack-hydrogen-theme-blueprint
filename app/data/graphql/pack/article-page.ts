import {SECTION_FRAGMENT} from './settings';

export const ARTICLE_PAGE_QUERY = `
  query Article($handle: String!, $version: Version, $cursor: String, $language: String, $country: String) @inContext(language: $language, country: $country) {
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
      firstPublishedAt
      publishedAt
      createdAt
      updatedAt
    }
  }
  ${SECTION_FRAGMENT}
` as const;

export const CMS_ARTICLES_QUERY = `
  query GetBackpackCmsArticlePages($first: Int, $cursor: String) {
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
