export const SITE_SETTINGS_QUERY = `
  query SiteSettings($version: Version) {
    siteSettings(version: $version) {
      id
      status
      settings
      publishedAt
      createdAt
      updatedAt
      favicon
      seo {
        title
        description
        keywords
      }
    }
  }
` as const;

export const PRODUCT_GROUPINGS_QUERY = `
  query ProductGroupings($first: Int!, $after: String) {
    groups(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          title
          description
          products {
            handle
            id
          }
          subgroups {
            id
            title
            description
            products {
              handle
              id
            }
          }
        }
      }
    }
  }
` as const;

export const SECTION_FRAGMENT = `
  fragment SectionFragment on Section {
    id
    title
    status
    data
    publishedAt
    createdAt
    updatedAt
    parentContentType
  }
` as const;
