import {Link} from '~/components';
import {useDataLayerViewSearchResults, useSettings} from '~/hooks';

import {SearchItem} from './SearchItem';
import type {SearchResultsProps} from './Search.types';

export function SearchResults({
  closeSearch,
  productResults,
  collectionResults,
  searchTerm,
}: SearchResultsProps) {
  const {search} = useSettings();

  useDataLayerViewSearchResults({
    products: productResults,
    searchTerm,
  });

  const collectionsEnabled = search?.results?.collectionsEnabled ?? true;

  return (
    <div className="scrollbar-hide relative flex flex-1 flex-col gap-4 overflow-y-auto pt-4">
      {productResults?.length > 0 && (
        <div>
          <h3 className="text-h5 px-4">Products</h3>

          <ul>
            {productResults.slice(0, 10).map((item, index) => {
              return (
                <li
                  key={index}
                  className="border-b border-b-border p-4 last:border-none"
                >
                  <SearchItem
                    closeSearch={closeSearch}
                    index={index}
                    searchTerm={searchTerm}
                    item={item}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {collectionsEnabled && collectionResults?.length > 0 && (
        <div className="mb-8 px-4">
          <h3 className="text-h5 mb-3">Collections</h3>

          <ul className="flex flex-col items-start gap-3">
            {collectionResults.map(({handle, title}, index) => {
              return (
                <li key={index}>
                  <Link aria-label={title} href={`/collections/${handle}`}>
                    <p className="text-underline">{title}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

SearchResults.displayName = 'SearchResults';
