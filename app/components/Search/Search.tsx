import {memo} from 'react';

import {Link} from '~/components/Link';
import {Drawer} from '~/components/Drawer';
import {useMenu, usePrefixPathWithLocale} from '~/hooks';

import {SearchInput} from './SearchInput';
import {SearchResults} from './SearchResults';
import {SearchSuggestions} from './SearchSuggestions';
import {useSearch} from './useSearch';

export const Search = memo(() => {
  const {closeSearch, searchOpen} = useMenu();
  const {
    productResults,
    collectionResults,
    hasAnyResults,
    hasNoProductResults,
    handleInput,
    handleClear,
    handleSuggestion,
    rawTerm,
    searchTerm,
    totalProductsCount,
  } = useSearch();
  const searchPageUrl = usePrefixPathWithLocale(`/search?q=${searchTerm}`);

  return (
    <Drawer
      ariaName="search drawer"
      heading="Search"
      onClose={closeSearch}
      open={searchOpen}
      openFrom="right"
    >
      <SearchInput
        closeSearch={closeSearch}
        handleSuggestion={handleSuggestion}
        handleClear={handleClear}
        handleInput={handleInput}
        rawTerm={rawTerm}
        searchOpen={searchOpen}
        searchTerm={searchTerm}
      />

      {hasAnyResults ? (
        <SearchResults
          closeSearch={closeSearch}
          collectionResults={collectionResults}
          productResults={productResults}
          searchTerm={searchTerm}
        />
      ) : (
        <SearchSuggestions
          handleSuggestion={handleSuggestion}
          hasNoProductResults={hasNoProductResults}
          searchTerm={searchTerm}
        />
      )}

      {productResults.length > 0 && (
        <div className="border-t border-t-border p-4">
          <Link
            aria-label="See all search results"
            className="btn-primary w-full"
            to={searchPageUrl}
            onClick={closeSearch}
          >
            See All {totalProductsCount} Results
          </Link>
        </div>
      )}
    </Drawer>
  );
});

Search.displayName = 'Search';
