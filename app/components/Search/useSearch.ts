import {useCallback, useEffect, useRef, useState, useMemo} from 'react';
import {useFetcher} from '@remix-run/react';
import debounce from 'lodash/debounce';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

import {useIsHydrated, useLocale, useSettings} from '~/hooks';

const PRODUCTS_LIMIT = 10;
const COLLECTIONS_LIMIT = 10;

interface ProductsFetcherData {
  searchResults: {results: Product[] | null; totalResults: number};
  searchTerm: string;
}
interface CollectionsFetcherData {
  searchResults: {results: Record<string, any>[] | null; totalResults: number};
  searchTerm: string;
}

export function useSearch() {
  const {search} = useSettings();
  const isHydrated = useIsHydrated();
  const {pathPrefix} = useLocale();

  const [rawTerm, setRawTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState(rawTerm);

  const productsFetcher = useFetcher<ProductsFetcherData>({
    key: `search-first:${searchTerm}`,
  });
  const collectionsFetcher = useFetcher<CollectionsFetcherData>({
    key: `predictive-search-collection:${searchTerm}`,
  });

  const collectionsEnabled = search?.results?.collectionsEnabled ?? true;

  useEffect(() => {
    if (!isHydrated) return;
    const searchParams = new URLSearchParams({
      q: searchTerm,
      count: PRODUCTS_LIMIT.toString(),
    });
    productsFetcher.load(`${pathPrefix}/api/search?${searchParams}`);
  }, [searchTerm]);

  useEffect(() => {
    if (!isHydrated || !collectionsEnabled) return;
    const searchParams = new URLSearchParams({
      q: searchTerm,
      limit: COLLECTIONS_LIMIT.toString(),
      type: 'COLLECTION',
    });
    collectionsFetcher.load(
      `${pathPrefix}/api/predictive-search?${searchParams}`,
    );
  }, [collectionsEnabled, searchTerm]);

  const totalProductsCount =
    productsFetcher.data?.searchResults?.totalResults ?? 0;
  const products = productsFetcher.data?.searchResults?.results ?? [];
  const collections =
    collectionsFetcher?.data?.searchResults?.results?.[0]?.items ?? [];
  const hasAnyResults = products.length || collections.length;
  const hasNoProductResults =
    !!productsFetcher.data?.searchTerm && totalProductsCount === 0;

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
