import {useCallback, useEffect, useRef, useState, useMemo} from 'react';
import debounce from 'lodash/debounce';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

import {useIsHydrated, useLoadData, useLocale, useSettings} from '~/hooks';

const PRODUCTS_LIMIT = 10;
const COLLECTIONS_LIMIT = 10;

interface ProductsData {
  searchResults: {results: Product[] | null; totalResults: number};
  searchTerm: string;
}
interface CollectionsData {
  searchResults: {results: Record<string, any>[] | null; totalResults: number};
  searchTerm: string;
}

export function useSearch() {
  const {search} = useSettings();
  const isHydrated = useIsHydrated();
  const {pathPrefix} = useLocale();

  const [rawTerm, setRawTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState(rawTerm);

  const collectionsEnabled = search?.results?.collectionsEnabled ?? true;

  const {data: productsData} = useLoadData<ProductsData>(
    isHydrated
      ? `${pathPrefix}/api/search?q=${searchTerm}&count=${PRODUCTS_LIMIT}`
      : null,
  );

  const {data: collectionsData} = useLoadData<CollectionsData>(
    isHydrated && collectionsEnabled
      ? `${pathPrefix}/api/predictive-search?q=${searchTerm}&limit=${COLLECTIONS_LIMIT}&type=COLLECTION`
      : null,
  );

  const totalProductsCount = productsData?.searchResults?.totalResults ?? 0;
  const products = productsData?.searchResults?.results ?? [];
  const collections = collectionsData?.searchResults?.results?.[0]?.items ?? [];
  const hasAnyResults = products.length || collections.length;
  const hasNoProductResults =
    !!productsData?.searchTerm && totalProductsCount === 0;

  const handleDebouncedInput = useCallback(() => {
    setSearchTerm(rawTerm.trim());
  }, [rawTerm]);

  const debouncedInputRef = useRef(handleDebouncedInput);

  useEffect(() => {
    debouncedInputRef.current = handleDebouncedInput;
  }, [handleDebouncedInput]);

  const doCallbackWithDebounce = useMemo(() => {
    const callback = () => debouncedInputRef.current();
    return debounce(callback, 300);
  }, []);

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      doCallbackWithDebounce();
      setRawTerm(e.target.value);
    },
    [doCallbackWithDebounce],
  );

  const handleClear = useCallback(() => {
    setRawTerm('');
    setSearchTerm('');
  }, []);

  const handleSuggestion = useCallback((suggestion: string) => {
    setRawTerm(suggestion);
    setSearchTerm(suggestion);
  }, []);

  return {
    productResults: products,
    collectionResults: collections,
    hasAnyResults,
    hasNoProductResults,
    handleInput,
    handleClear,
    handleSuggestion,
    rawTerm,
    searchTerm,
    totalProductsCount,
  };
}
