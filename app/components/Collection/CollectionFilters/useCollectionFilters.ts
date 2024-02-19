import {useCollectionFiltersContext} from './CollectionFiltersProvider';
import type {ContextProviderValue} from './CollectionFilters.types';

export function useCollectionFilters() {
  const {state, actions} =
    useCollectionFiltersContext() as ContextProviderValue;
  return {
    ...state,
    ...actions,
  };
}
