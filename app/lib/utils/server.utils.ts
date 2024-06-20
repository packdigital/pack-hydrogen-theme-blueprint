import type {AppLoadContext} from '@shopify/remix-oxygen';
import type {
  Filter,
  FilterValue,
  ProductFilter,
  Metafield,
} from '@shopify/hydrogen/storefront-api-types';

import {
  COLLECTION_FILTERS_QUERY,
  LAYOUT_QUERY,
  METAFIELD_FRAGMENT,
  PRODUCT_GROUPINGS_QUERY,
  PRODUCTS_SEARCH_FILTERS_QUERY,
  SITE_SETTINGS_QUERY,
} from '~/data/queries';
import {PRICE_FILTER_ID} from '~/lib/constants';
import type {ActiveFilterValue} from '~/components/Collection/CollectionFilters/CollectionFilters.types';
import type {Group, RootSiteSettings, Seo} from '~/lib/types';

export const getShop = async (context: AppLoadContext) => {
  const layout = await context.storefront.query(LAYOUT_QUERY, {
    cache: context.storefront.CacheShort(),
  });
  return layout.shop;
};

export const getSiteSettings = async (
  context: AppLoadContext,
): Promise<RootSiteSettings> => {
  return (await context.pack.query(SITE_SETTINGS_QUERY, {
    cache: context.storefront.CacheLong(),
  })) as RootSiteSettings;
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
  const shop = await getShop(context);
  const siteSettings = await getSiteSettings(context);
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

export const getEnvs = async ({
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
        PRODUCTS_SEARCH_FILTERS_QUERY,
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
        COLLECTION_FILTERS_QUERY,
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

export const getMetafields = async (
  context: AppLoadContext,
  {
    handle,
    metafieldQueries,
  }: {
    handle: string | undefined;
    metafieldQueries: {key: string; namespace: string}[];
  },
): Promise<Record<string, Metafield | null> | null> => {
  const {storefront} = context;

  if (!handle || !metafieldQueries?.length) return null;

  const PRODUCT_METAFIELDS_QUERY = `#graphql
    query product(
      $handle: String!
      $country: CountryCode
      $language: LanguageCode
    ) @inContext(country: $country, language: $language) {
      product(handle: $handle) {
        ${metafieldQueries.map(
          ({key, namespace}, index) => `
            metafields_${index}: metafields(
              identifiers: {key: "${key}", namespace: "${namespace}"}
            ) {
              ...metafield
            }
          `,
        )}
      }
    }
    ${METAFIELD_FRAGMENT}
  `;

  const {product} = await storefront.query(PRODUCT_METAFIELDS_QUERY, {
    variables: {
      handle,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
    cache: storefront.CacheShort(),
  });

  const metafields = Object.entries({...product}).reduce(
    (acc: Record<string, Metafield | null>, entry) => {
      const [key, value] = entry as [string, Metafield[]];
      const originalIndex = key.split('_').pop();
      const query = metafieldQueries[Number(originalIndex)];
      acc[`${query.namespace}.${query.key}`] = value?.[0] || null;
      return acc;
    },
    {},
  );
  return metafields;
};
