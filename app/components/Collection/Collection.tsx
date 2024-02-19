import {useMemo, useState} from 'react';
import {useSiteSettings} from '@pack/react';

import type {SiteSettings} from '~/lib/types';
import {useColorSwatches, useDataLayerViewCollection} from '~/hooks';

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
}: CollectionProps) {
  const {handle, products, title} = collection;
  const swatchesMap = useColorSwatches();
  const siteSettings = useSiteSettings() as SiteSettings;

  const [desktopFiltersOpen, setDesktopFiltersOpen] = useState(
    activeFilterValues.length > 0,
  );
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const settings = siteSettings?.settings?.collection;
  const promotion = settings?.promotion;
  const enabledFilters = settings?.filters?.enabled ?? true;
  const enabledSort = settings?.sort?.enabled ?? true;
  const isSearchResults = handle === 'search';

  const promoTiles = useMemo(() => {
    if (!promotion?.campaigns?.length) return null;
    const campaign = promotion.campaigns.find(({collections, enabled}) => {
      if (!enabled) return false;
      return collections?.some((colHandle) => colHandle.trim() === handle);
    });
    return campaign?.promoTiles || null;
  }, [handle, promotion?.campaigns]);

  useDataLayerViewCollection({
    collection: isSearchResults ? null : collection,
  });

  return (
    <CollectionFiltersProvider
      activeFilterValues={activeFilterValues}
      filters={products.filters}
    >
      <div className="md:px-contained py-contained mx-auto grid w-full max-w-[var(--content-max-width)] !pt-0">
        {showHeading && (
          <h1 className="text-title-h2 py-contained mb-4 !pb-0 text-center max-md:px-4 md:mb-2">
            {title}
          </h1>
        )}

        {(enabledFilters || enabledSort) && (
          <div
            className={`grid w-full grid-cols-2 justify-between md:gap-x-6 ${
              !showHeading ? 'md:mt-4' : ''
            }`}
          >
            {enabledFilters && (
              <CollectionFiltersButton
                desktopFiltersOpen={desktopFiltersOpen}
                setDesktopFiltersOpen={setDesktopFiltersOpen}
                setMobileFiltersOpen={setMobileFiltersOpen}
              />
            )}

            {enabledSort && (
              <CollectionSort
                isSearchResults={isSearchResults}
                settings={settings}
              />
            )}
          </div>
        )}

        {enabledFilters && (
          <CollectionFiltersSummary className="px-4 pt-4 md:hidden" />
        )}

        <div
          className={`mt-6 grid gap-x-6 ${
            desktopFiltersOpen ? 'md:grid-cols-[13rem_1fr]' : 'md:grid-cols-1'
          }`}
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
            isSearchResults={isSearchResults}
            products={products}
            promoTiles={promoTiles}
            searchTerm={searchTerm}
            settings={settings}
            swatchesMap={swatchesMap}
          />
        </div>
      </div>
    </CollectionFiltersProvider>
  );
}

Collection.displayName = 'Collection';
