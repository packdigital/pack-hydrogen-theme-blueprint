import {useEffect, useRef} from 'react';
import {useLocation, useNavigate} from '@remix-run/react';

import {Svg} from '~/components';
import {useLocale} from '~/hooks';

import {SearchAutocomplete} from './SearchAutocomplete';
import type {SearchInputProps} from './Search.types';

export function SearchInput({
  closeSearch,
  handleClear,
  handleInput,
  handleSuggestion,
  rawTerm,
  searchOpen,
  searchTerm,
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const {search} = useLocation();
  const navigate = useNavigate();
  const {pathPrefix} = useLocale();

  useEffect(() => {
    if (!searchOpen || !inputRef.current) return;
    inputRef.current.focus();
  }, [searchOpen]);

  return (
    <div className="border-b border-b-border p-4">
      <div className="relative flex justify-between gap-3 rounded-full border border-border pl-3 pr-4">
        <Svg
          className="w-5 text-text"
          src="/svgs/search.svg#search"
          title="Search"
          viewBox="0 0 24 24"
        />

        <input
          aria-label="Search here"
          className="min-w-0 flex-1 py-3 text-base outline-none"
          onChange={handleInput}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' && !!e.currentTarget.value) {
              const params = new URLSearchParams(search);
              params.set('q', e.currentTarget.value);
              closeSearch();
              navigate({
                pathname: `${pathPrefix}/search`,
                search: `?${params.toString()}`,
              });
            }
          }}
          placeholder="Search here"
          ref={inputRef}
          value={rawTerm}
        />

        <button
          aria-label="Clear search"
          className={`${rawTerm ? '' : 'invisible'}`}
          onClick={handleClear}
          type="button"
        >
          <Svg
            className="w-4 text-text"
            src="/svgs/close.svg#close"
            title="Close"
            viewBox="0 0 24 24"
          />
        </button>
      </div>

      <SearchAutocomplete
        handleSuggestion={handleSuggestion}
        searchTerm={searchTerm}
      />
    </div>
  );
}

SearchInput.displayName = 'SearchInput';
