import type {AppLoadContext} from '@shopify/remix-oxygen';
import type {
  Filter,
  FilterValue,
  ProductFilter,
} from '@shopify/hydrogen/storefront-api-types';

import {PRICE_FILTER_ID} from '~/lib/constants';
import type {ActiveFilterValue} from '~/components/Collection/CollectionFilters/CollectionFilters.types';
import type {RootSiteSettings} from '~/lib/types';

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
