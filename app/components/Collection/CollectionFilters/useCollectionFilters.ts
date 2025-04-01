import {useCollectionFiltersContext} from './useCollectionFiltersContext';
import type {ContextProviderValue} from './CollectionFilters.types';

export function useCollectionFilters() {
  const {state, actions} =
    useCollectionFiltersContext() as ContextProviderValue;
  return {
    ...state,
    ...actions,
  };
}
