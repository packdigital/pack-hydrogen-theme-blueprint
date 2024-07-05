import {useEffect} from 'react';
import {useFetcher} from '@remix-run/react';

import {useIsHydrated, useLocale, useSettings} from '~/hooks';

import type {SearchAutocompleteProps} from './Search.types';

interface AutocompleteFetcherData {
  searchResults: {results: Record<string, any>[] | null; totalResults: number};
  searchTerm: string;
}

export function SearchAutocomplete({
  handleSuggestion,
  searchTerm,
}: SearchAutocompleteProps) {
  const {search} = useSettings();
  const isHydrated = useIsHydrated();
  const {pathPrefix} = useLocale();
  const fetcher = useFetcher<AutocompleteFetcherData>({
    key: `predictive-search-query:${searchTerm}`,
  });

  const {enabled, heading, limit} = {...search?.autocomplete};

  useEffect(() => {
    if (!isHydrated) return;
    const searchParams = new URLSearchParams({
      q: searchTerm,
      limit: limit?.toString(),
      type: 'QUERY',
    });
    fetcher.load(`${pathPrefix}/api/predictive-search?${searchParams}`);
  }, [searchTerm]);

  const autocompleteResults = fetcher?.data?.searchResults?.results?.[0]?.items;

  return enabled && autocompleteResults && autocompleteResults.length > 0 ? (
    <div className="mt-4">
      <h3 className="text-xs italic">{heading}</h3>

      <ul className="flex flex-wrap gap-x-2">
        {autocompleteResults.map(({title}: {title: string}) => {
          return (
            <li key={title}>
              <button
                aria-label={title}
                onClick={() => handleSuggestion(title)}
                type="button"
              >
                <p className="text-underline text-xs">{title}</p>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  ) : null;
}

SearchAutocomplete.displayName = 'SearchAutocomplete';
