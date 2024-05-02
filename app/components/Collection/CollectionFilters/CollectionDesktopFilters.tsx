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

  const {
    optionsMaxCount = 6,
    showCount = true,
    sticky = true,
  } = {...collectionSettings?.filters};
  const stickyPromobar =
    header?.promobar?.enabled && !header?.promobar?.autohide;
  const stickyTopClass = stickyPromobar
    ? 'md:top-[calc(var(--header-height)+var(--promobar-height)+1.5rem)]'
    : 'md:top-[calc(var(--header-height)+1.5rem)]';

  useEffect(() => {
    if (desktopFiltersOpen) setMounted(true);
  }, [desktopFiltersOpen]);

  return (
    <div
      className={`flex-col gap-5 md:sticky ${
        desktopFiltersOpen ? 'max-md:hidden md:flex' : 'hidden'
      } ${sticky ? stickyTopClass : ''}`}
    >
      <div className="overflow-hidden rounded border border-border max-md:hidden">
        <div className="max-h-[calc(var(--viewport-height)-var(--header-height)-100px)] overflow-y-auto overflow-x-hidden">
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
                        optionsMaxCount={optionsMaxCount}
                        removeFilter={removeFilter}
                        showCount={showCount}
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
  );
}

CollectionDesktopFilters.displayName = 'CollectionDesktopFilters';
