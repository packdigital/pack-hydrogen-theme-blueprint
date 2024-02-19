import {useEffect} from 'react';
import {useFetcher} from '@remix-run/react';
import {useSiteSettings} from '@pack/react';

import type {SiteSettings} from '~/lib/types';
import {useIsHydrated, useLocale} from '~/hooks';

import type {SearchAutocompleteProps} from './Search.types';

interface AutocompleteFetcherData {
  searchResults: {results: Record<string, any>[] | null; totalResults: number};
  searchTerm: string;
}

export function SearchAutocomplete({
  handleSuggestion,
  searchTerm,
}: SearchAutocompleteProps) {
  const siteSettings = useSiteSettings() as SiteSettings;
  const isHydrated = useIsHydrated();
  const locale = useLocale();
  const fetcher = useFetcher<AutocompleteFetcherData>({
    key: `predictive-search-query:${searchTerm}`,
  });

  const {enabled, heading, limit} = {
    ...siteSettings?.settings?.search?.autocomplete,
  };

  useEffect(() => {
    if (!isHydrated) return;
    fetcher.submit(
      {q: searchTerm, limit, type: 'QUERY'},
      {method: 'POST', action: `${locale.pathPrefix}/api/predictive-search`},
    );
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
