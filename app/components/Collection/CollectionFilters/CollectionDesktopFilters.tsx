import {useEffect, useState} from 'react';

import {useSettings} from '~/hooks';

import type {CollectionDesktopFiltersProps} from './CollectionFilters.types';
import {CollectionFilterDropdown} from './CollectionFilterDropdown';
import {CollectionFiltersSummary} from './CollectionFiltersSummary';
import {useCollectionFilters} from './useCollectionFilters';

export function CollectionDesktopFilters({
  desktopFiltersOpen,
  swatchesMap,
}: CollectionDesktopFiltersProps) {
  const {collection: collectionSettings, header} = useSettings();
  const {activeFilterValues, addFilter, filters, removeFilter} =
    useCollectionFilters();

  const [mounted, setMounted] = useState(activeFilterValues.length > 0);

  const {sticky = true} = {...collectionSettings?.filters};
  const stickyPromobar =
    header?.promobar?.enabled && !header?.promobar?.autohide;
  const stickyTopClass = stickyPromobar
    ? 'md:top-[calc(var(--header-height-desktop)+var(--promobar-height-desktop)+1.5rem)]'
    : 'md:top-[calc(var(--header-height-desktop)+1.5rem)]';

  useEffect(() => {
    if (desktopFiltersOpen) setMounted(true);
  }, [desktopFiltersOpen]);

  return (
    <div className={`${desktopFiltersOpen ? 'max-md:hidden' : 'hidden'}`}>
      <div
        className={`flex flex-col gap-5 md:sticky ${
          sticky ? stickyTopClass : ''
        }`}
      >
        <div className="overflow-hidden rounded border border-border max-md:hidden">
          <div className="scrollbar-hide max-h-[calc(var(--viewport-height)-var(--header-height-desktop)-100px)] overflow-y-auto overflow-x-hidden">
            {!!filters.length && (
              <ul className="overflow-y-auto">
                {filters.map((filter, index) => {
                  if (!filter.values.length) return null;

                  return (
                    <li className="[&>div]:last:border-b-0" key={index}>
                      {mounted && (
                        <CollectionFilterDropdown
                          activeFilterValues={activeFilterValues}
                          addFilter={addFilter}
                          filter={filter}
                          removeFilter={removeFilter}
                          swatchesMap={swatchesMap}
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <CollectionFiltersSummary className="max-md:hidden" />
      </div>
    </div>
  );
}

CollectionDesktopFilters.displayName = 'CollectionDesktopFilters';
