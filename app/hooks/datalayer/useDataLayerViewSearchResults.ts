import {useEffect} from 'react';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

import {useGlobal} from '~/hooks';

export function useDataLayerViewSearchResults({
  isSearchPage,
  products,
  searchTerm,
}: {
  isSearchPage?: boolean;
  products: Product[];
  searchTerm?: string;
}) {
  const {emitter} = useGlobal();

  const SEARCH_EVENT = isSearchPage
    ? 'VIEW_SEARCH_PAGE_RESULTS'
    : 'VIEW_SEARCH_RESULTS';

  useEffect(() => {
    if (!emitter?._events[SEARCH_EVENT]) return;
    if (!products?.length || !searchTerm) return;
    const results = products.slice(0, 12).map((product) => {
      return {...product, searchTerm};
    });
    emitter?.emit(SEARCH_EVENT, results);
  }, [emitter?._eventsCount, products, searchTerm]);
}
