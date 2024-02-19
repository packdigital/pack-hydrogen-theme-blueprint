import type {ReactNode} from 'react';
import {createContext, useCallback, useContext, useMemo} from 'react';
import {useSearchParams} from '@remix-run/react';
import type {Filter} from '@shopify/hydrogen/storefront-api-types';

import {PRICE_FILTER_ID} from '~/lib/constants';

import type {ActiveFilterValue} from './CollectionFilters.types';

const getFilterKeyValueFromId = (id: string) => {
  const splitId = id.split('.');
  const key = splitId.slice(0, -1).join('.');
  const value = splitId.slice(-1)[0];
  return [key, value];
};

const Context = createContext({state: {}, actions: {}});

export function CollectionFiltersProvider({
  activeFilterValues,
  children,
  filters,
}: {
  activeFilterValues: ActiveFilterValue[];
  children: ReactNode;
  filters: Filter[];
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const addFilter = useCallback(
    (id: string) => {
      if (!id) return;
      const [key, value] = getFilterKeyValueFromId(id);
      const isPrice = key === PRICE_FILTER_ID;
      if (isPrice) {
        const [min, max] = value.split('-').map(Number);
        if (min >= 0 && max >= 0) {
          searchParams.set(key, value);
        }
      } else {
        const currentParamValue = searchParams.get(key) || '';
        const newParamValue = `${
          currentParamValue ? `${currentParamValue},` : ''
        }${value}`;
        searchParams.set(key, newParamValue);
      }
      setSearchParams(searchParams);
    },
    [activeFilterValues, searchParams],
  );

  const removeFilter = useCallback(
    (id: string) => {
      const [key, value] = getFilterKeyValueFromId(id);
      const currentParamValue = searchParams.get(key) || '';
      const paramValues = currentParamValue
        .toLowerCase()
        .split(',')
        .filter(Boolean);
      const newParamValue = paramValues
        .filter((paramValue) => paramValue !== value)
        .join(',');
      if (!newParamValue) {
        searchParams.delete(key);
      } else {
        searchParams.set(key, newParamValue);
      }
      setSearchParams(searchParams);
    },
    [activeFilterValues, searchParams],
  );

  const clearFilters = useCallback(() => {
    [...searchParams.entries()].forEach(([key]) => {
      if (key.startsWith('filter.')) searchParams.delete(key);
    });
    setSearchParams(searchParams);
  }, [searchParams]);

  const value = useMemo(
    () => ({
      state: {activeFilterValues, filters},
      actions: {addFilter, removeFilter, clearFilters},
    }),
    [activeFilterValues, addFilter, clearFilters, filters, removeFilter],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export const useCollectionFiltersContext = () => useContext(Context);
