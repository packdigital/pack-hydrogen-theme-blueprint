import {useEffect, useRef} from 'react';
import {useLocation, useNavigate} from 'react-router';
import clsx from 'clsx';

import {Svg} from '~/components/Svg';
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
    <form
      className="border-b border-b-border p-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!rawTerm) return;
        const params = new URLSearchParams(search);
        params.set('q', rawTerm);
        closeSearch();
        navigate({
          pathname: `${pathPrefix}/search`,
          search: `?${params.toString()}`,
        });
      }}
      role="search"
    >
      <div className="relative flex justify-between gap-3 rounded-full border border-inputBorder pl-3 pr-4 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focusRing">
        <Svg
          className="w-5 text-text"
          src="/svgs/search.svg#search"
          title="Search"
          viewBox="0 0 24 24"
        />

        <input
          aria-label="Search here"
          className="min-w-0 flex-1 py-3 text-base focus-visible:outline-none"
          enterKeyHint="search"
          onChange={handleInput}
          placeholder="Search here"
          ref={inputRef}
          value={rawTerm}
        />

        <button
          aria-label="Clear search"
          className={clsx(!rawTerm && 'invisible')}
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
    </form>
  );
}

SearchInput.displayName = 'SearchInput';
