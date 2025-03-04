import type {AppLoadContext} from '@shopify/remix-oxygen';
import type {
  Filter,
  FilterValue,
  ProductFilter,
  Metafield,
} from '@shopify/hydrogen/storefront-api-types';

import {
  PRODUCT_GROUPINGS_QUERY,
  SITE_SETTINGS_QUERY,
} from '~/data/graphql/pack/settings';
import {LAYOUT_QUERY} from '~/data/graphql/storefront/shop';
import {PRICE_FILTER_ID} from '~/lib/constants';
import type {ActiveFilterValue} from '~/components/Collection/CollectionFilters/CollectionFilters.types';
import type {
  Group,
  MetafieldIdentifier,
  RootSiteSettings,
  Seo,
} from '~/lib/types';

import {parseMetafieldsFromProduct} from './product.utils';

export const getShop = async (context: AppLoadContext) => {
  const layout = await context.storefront.query(LAYOUT_QUERY, {
    cache: context.storefront.CacheShort(),
  });
  return layout?.shop;
};

export const getSiteSettings = async (
  context: AppLoadContext,
): Promise<RootSiteSettings> => {
  return context.pack.query(SITE_SETTINGS_QUERY, {
    cache: context.storefront.CacheLong(),
  }) as RootSiteSettings;
};

export const getProductGroupings = async (context: AppLoadContext) => {
  const getAllProductGroupings = async ({
    groupings,
    cursor,
  }: {
    groupings: Group[] | null;
    cursor: string | null;
  }): Promise<Group[] | null> => {
    const {data} = await context.pack.query(PRODUCT_GROUPINGS_QUERY, {
      variables: {first: 250, after: cursor},
      cache: context.storefront.CacheLong(),
    });
    if (!data?.groups) return null;

    const queriedGroupings =
      data.groups.edges?.map(({node}: {node: Group}) => node) || [];
    const {endCursor, hasNextPage} = data.groups.pageInfo || {};

    const compiledGroupings = [...(groupings || []), ...queriedGroupings];
    if (hasNextPage) {
      return getAllProductGroupings({
        groupings: compiledGroupings,
        cursor: endCursor,
      });
    }
    return compiledGroupings;
  };
  const groupings = await getAllProductGroupings({
    groupings: null,
    cursor: null,
  });
  return groupings || null;
};

export const getAccountSeo = async (
  context: AppLoadContext,
  accountTitle: string,
) => {
  const [shop, siteSettings] = await Promise.all([
    getShop(context),
    getSiteSettings(context),
  ]);
  const {title: seoSiteTitle} = {
    ...siteSettings?.data?.siteSettings?.seo,
  } as Seo;
  const noIndex =
    !!siteSettings?.data?.siteSettings?.settings?.account?.noIndex;
  const noFollow =
    !!siteSettings?.data?.siteSettings?.settings?.account?.noFollow;
  const robots = {noIndex, noFollow};
  const siteTitle = seoSiteTitle || shop?.name || '';
  const title = `${accountTitle} | ${siteTitle}`;
  const seo = {title, robots};
  return seo;
};

export const getPrimaryDomain = ({
  context,
  request,
}: {
  context: AppLoadContext;
  request?: Request;
}) => {
  const PRIMARY_DOMAIN = context.env.PRIMARY_DOMAIN;
  let primaryDomainOrigin = '';
  if (PRIMARY_DOMAIN) {
    try {
      primaryDomainOrigin = new URL(PRIMARY_DOMAIN).origin;
    } catch (error) {}
  }
  if (!primaryDomainOrigin && request) {
    primaryDomainOrigin = new URL(request.url).origin;
  }
  return primaryDomainOrigin;
};

export const getPublicEnvs = async ({
  context,
  request,
}: {
  context: AppLoadContext;
  request?: Request;
}): Promise<Record<string, string>> => {
  const PRIMARY_DOMAIN = getPrimaryDomain({context, request});

  const publicEnvs = Object.entries({...context.env}).reduce(
    (acc: any, [key, value]) => {
      if (key.startsWith('PUBLIC_')) acc[key] = value;
      return acc;
    },
    {},
  );

  return {...publicEnvs, PRIMARY_DOMAIN};
};

export const getFilters = async ({
  handle,
  searchParams,
  searchTerm,
  siteSettings,
  storefront,
}: {
  handle?: string;
  searchParams: URLSearchParams;
  searchTerm?: string;
  siteSettings: RootSiteSettings;
  storefront: AppLoadContext['storefront'];
}): Promise<{
  activeFilterValues: ActiveFilterValue[];
  filters: ProductFilter[];
}> => {
  const enabledFilters =
    siteSettings?.data?.siteSettings?.settings?.collection?.filters?.enabled ??
    true;

  let activeFilterValues: ActiveFilterValue[] = [];
  let defaultFilters: Filter[] = [];

  if (enabledFilters) {
    if (searchTerm) {
      const defaultFiltersData = await storefront.query(
        `#graphql
          query ProductsSearchFilters(
            $country: CountryCode
            $language: LanguageCode
            $searchTerm: String!
          ) @inContext(country: $country, language: $language) {
            search(
              first: 1,
              query: $searchTerm,
              types: PRODUCT,
            ) {
              filters: productFilters {
                id
                label
                type
                values {
                  id
                  label
                  count
                  input
                }
              }
            }
          }

        `,
        {
          variables: {
            searchTerm,
            country: storefront.i18n.country,
            language: storefront.i18n.language,
          },
          cache: storefront.CacheShort(),
        },
      );
      defaultFilters = defaultFiltersData.search?.filters;
    } else if (handle) {
      const defaultFiltersData = await storefront.query(
        `#graphql
          query CollectionFilters(
            $handle: String!,
            $country: CountryCode,
            $language: LanguageCode
          ) @inContext(country: $country, language: $language) {
            collection(handle: $handle) {
              products(first: 1) {
                filters {
                  id
                  label
                  type
                  values {
                    id
                    label
                    count
                    input
                  }
                }
              }
            }
          }
        `,
        {
          variables: {
            handle,
            country: storefront.i18n.country,
            language: storefront.i18n.language,
          },
          cache: storefront.CacheShort(),
        },
      );
      defaultFilters = defaultFiltersData.collection?.products?.filters;
    }

    activeFilterValues = [...searchParams.entries()].reduce(
      (acc: any[], [_paramKey, _paramValue]) => {
        const paramKey = _paramKey.toLowerCase();
        const paramValue = _paramValue.toLowerCase();

        if (acc.some(({id}) => id === `${paramKey}.${paramValue}`)) return acc;

        const filter = defaultFilters?.find(
          (defaultFilter: Filter) => defaultFilter.id === paramKey,
        );
        if (!filter) return acc;

        if (paramKey === PRICE_FILTER_ID) {
          const value = filter.values[0];
          let defaultPrice = {price: {min: null, max: null}};
          try {
            defaultPrice = JSON.parse(value.input as string);
          } catch (error) {}
          const [min, max] = paramValue.split('-').map(Number);
          const {min: defaultMin, max: defaultMax} = defaultPrice.price;
          if (min === defaultMin && max === defaultMax) return acc;
          if (min >= 0 && max >= 0) {
            acc.push({
              ...value,
              parsedInput: {price: {min, max}},
              parsedDefaultInput: defaultPrice,
              filter: {id: filter.id, label: filter.label, type: filter.type},
            });
          }
          return acc;
        }
        const paramValues = paramValue.split(',').filter(Boolean);
        paramValues.forEach((__paramValue) => {
          if (acc.some(({id}) => id === `${paramKey}.${__paramValue}`)) return;
          const paramValueId = `${paramKey}.${__paramValue}`;
          const value = filter.values.find(
            (filterValue: FilterValue) => filterValue.id === paramValueId,
          ) as FilterValue;
          if (value) {
            try {
              acc.push({
                ...value,
                parsedInput: JSON.parse(value.input as string),
                filter: {id: filter.id, label: filter.label, type: filter.type},
              });
            } catch (error) {}
          }
        }, []);
        return acc;
      },
      [],
    );
  }

  const filters = activeFilterValues.map(({parsedInput}) => parsedInput);

  return {activeFilterValues, filters};
};

/*
 * IMPORTANT: Update both metafields query strings together, one for Storefront
 * API and Admin API
 */

/* Metafields graphql query with Storefront API */
export const getMetafieldsQueryString = (
  identifiers: MetafieldIdentifier[] = [],
) => {
  const identifiersString = JSON.stringify(identifiers)
    .replaceAll('"namespace"', 'namespace')
    .replaceAll('"key"', 'key');
  return `
    metafields(identifiers: ${identifiersString}) {
      createdAt
      description
      id
      key
      namespace
      type
      updatedAt
      value
      references(first: 10) {
        nodes {
          ... on Metaobject {
            fields {
              key
              type
              value
            }
          }
        }
      }
    }`;
};

/* Metafields graphql query with Admin API for draft products */
export const ADMIN_PRODUCTS_METAFIELDS_QUERY_STRING = `
  metafields(first: 50) {
    nodes {
      createdAt
      description
      id
      key
      namespace
      type
      updatedAt
      value
      references(first: 10) {
        nodes {
          ... on Metaobject {
            fields {
              key
              type
              value
            }
          }
        }
      }
    }
  }`;

export const getMetafields = async (
  context: AppLoadContext,
  {
    handle,
    isDraftProduct,
    identifiers,
  }: {
    handle: string | undefined;
    isDraftProduct?: boolean;
    identifiers: MetafieldIdentifier[];
  },
): Promise<Record<string, Metafield | null> | null> => {
  const {admin, storefront} = context;

  if (!handle || !identifiers?.length) return null;

  let metafields;

  if (admin && isDraftProduct) {
    const ADMIN_PRODUCT_METAFIELDS_QUERY = `
      query AdminProductMetafields(
        $handle: String!
      ) {
        productByIdentifier(identifier: {handle: $handle}) {
          ${ADMIN_PRODUCTS_METAFIELDS_QUERY_STRING}
        }
      }
    `;

    const {productByIdentifier: adminProduct} = await admin.query(
      ADMIN_PRODUCT_METAFIELDS_QUERY,
      {
        variables: {
          handle,
        },
        cache: admin.CacheShort(),
      },
    );

    if (!adminProduct) return {};

    metafields = parseMetafieldsFromProduct({
      product: {...adminProduct, metafields: adminProduct.metafields?.nodes},
      identifiers,
    });
  } else {
    const PRODUCT_METAFIELDS_QUERY = `#graphql
      query ProductMetafields(
        $handle: String!
        $country: CountryCode
        $language: LanguageCode
      ) @inContext(country: $country, language: $language) {
        product(handle: $handle) {
          ${getMetafieldsQueryString(identifiers)}
        }
      }
    `;

    const {product: storefrontProduct} = await storefront.query(
      PRODUCT_METAFIELDS_QUERY,
      {
        variables: {
          handle,
          country: storefront.i18n.country,
          language: storefront.i18n.language,
        },
        cache: storefront.CacheShort(),
      },
    );

    if (!storefrontProduct) return {};

    metafields = parseMetafieldsFromProduct({
      product: storefrontProduct,
      identifiers,
    });
  }

  return metafields;
};
