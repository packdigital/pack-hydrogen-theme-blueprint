import {useMemo, useState} from 'react';
import clsx from 'clsx';

import {useColorSwatches, useSettings} from '~/hooks';

import {
  CollectionDesktopFilters,
  CollectionFiltersButton,
  CollectionFiltersProvider,
  CollectionFiltersSummary,
  CollectionMobileFilters,
} from './CollectionFilters';
import {CollectionGrid} from './CollectionGrid';
import {CollectionSort} from './CollectionSort';
import type {CollectionProps} from './Collection.types';

export function Collection({
  activeFilterValues,
  collection,
  searchTerm,
  showHeading = true,
  title = '',
}: CollectionProps) {
  const {handle, products} = collection;
  const swatchesMap = useColorSwatches();
  const {collection: collectionSettings} = useSettings();

  const [desktopFiltersOpen, setDesktopFiltersOpen] = useState(
    activeFilterValues.length > 0,
  );
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const {filters, promotion, sort} = {...collectionSettings};
  const isDisabledFiltersCollection =
    filters?.disabledByHandle?.includes(handle);
  const enabledFilters =
    (filters?.enabled ?? true) && !isDisabledFiltersCollection;
  const enabledSort = sort?.enabled ?? true;
  const isSearchResults = handle === 'search';
  const noSearchResults = isSearchResults && !products.nodes?.length;

  const promoTiles = useMemo(() => {
    if (!promotion?.campaigns?.length) return null;
    const campaign = promotion.campaigns.find(({collections, enabled}) => {
      if (!enabled) return false;
      return collections?.some((colHandle) => colHandle.trim() === handle);
    });
    return campaign?.promoTiles || null;
  }, [handle, promotion?.campaigns]);

  return (
    <CollectionFiltersProvider
      activeFilterValues={activeFilterValues}
      filters={products.filters}
    >
      <div className="md:px-contained py-contained mx-auto grid w-full max-w-[var(--content-max-width)] !pt-0">
        {showHeading && (
          <h1 className="text-h2 py-contained mb-4 !pb-0 text-center max-md:px-4 md:mb-2">
            {title}
          </h1>
        )}

        {(enabledFilters || enabledSort) && !noSearchResults && (
          <div
            className={clsx(
              'grid w-full grid-cols-2 gap-x-4 max-md:px-4 max-md:pt-4 md:gap-x-6',
              !showHeading && 'md:mt-4',
            )}
          >
            <div className="flex">
              {enabledFilters && (
                <CollectionFiltersButton
                  desktopFiltersOpen={desktopFiltersOpen}
                  setDesktopFiltersOpen={setDesktopFiltersOpen}
                  setMobileFiltersOpen={setMobileFiltersOpen}
                />
              )}
            </div>

            <div className="flex">
              {enabledSort && (
                <CollectionSort
                  isSearchResults={isSearchResults}
                  settings={collectionSettings}
                />
              )}
            </div>
          </div>
        )}

        {enabledFilters && (
          <CollectionFiltersSummary className="px-4 pt-4 md:hidden" />
        )}

        <div
          className={clsx(
            'mt-6 grid gap-x-6',
            desktopFiltersOpen ? 'md:grid-cols-[13rem_1fr]' : 'md:grid-cols-1',
          )}
        >
          {enabledFilters && (
            <>
              <CollectionDesktopFilters
                desktopFiltersOpen={desktopFiltersOpen}
                swatchesMap={swatchesMap}
              />
              <CollectionMobileFilters
                mobileFiltersOpen={mobileFiltersOpen}
                setMobileFiltersOpen={setMobileFiltersOpen}
                swatchesMap={swatchesMap}
              />
            </>
          )}

          <CollectionGrid
            desktopFiltersOpen={desktopFiltersOpen}
            products={products}
            promoTiles={promoTiles}
            searchTerm={searchTerm}
            settings={collectionSettings}
            swatchesMap={swatchesMap}
          />
        </div>
      </div>
    </CollectionFiltersProvider>
  );
}

Collection.displayName = 'Collection';
