import {useCallback, useEffect, useRef, useState, useMemo} from 'react';
import {useFetcher} from '@remix-run/react';
import debounce from 'lodash/debounce';
import {useSiteSettings} from '@pack/react';

import type {SiteSettings} from '~/lib/types';
import {useIsHydrated, useLocale} from '~/hooks';

const PRODUCTS_LIMIT = 10;
const COLLECTIONS_LIMIT = 10;

interface ProductsFetcherData {
  searchResults: {results: Record<string, any>[] | null; totalResults: number};
  searchTerm: string;
}
interface CollectionsFetcherData {
  searchResults: {results: Record<string, any>[] | null; totalResults: number};
  searchTerm: string;
}

export function useSearch() {
  const siteSettings = useSiteSettings() as SiteSettings;
  const isHydrated = useIsHydrated();
  const locale = useLocale();

  const [rawTerm, setRawTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState(rawTerm);

  const productsFetcher = useFetcher<ProductsFetcherData>({
    key: `search-first:${searchTerm}`,
  });
  const collectionsFetcher = useFetcher<CollectionsFetcherData>({
    key: `predictive-search-collection:${searchTerm}`,
  });

  const collectionsEnabled =
    siteSettings?.settings?.search?.results?.collectionsEnabled ?? true;

  useEffect(() => {
    if (!isHydrated) return;
    productsFetcher.submit(
      {q: searchTerm, count: PRODUCTS_LIMIT},
      {method: 'POST', action: `${locale.pathPrefix}/search`},
    );
  }, [searchTerm]);

  useEffect(() => {
    if (!isHydrated || !collectionsEnabled) return;
    collectionsFetcher.submit(
      {q: searchTerm, limit: COLLECTIONS_LIMIT, type: 'COLLECTION'},
      {method: 'POST', action: `${locale.pathPrefix}/api/predictive-search`},
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
    (e) => {
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
