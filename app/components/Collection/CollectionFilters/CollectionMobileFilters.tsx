import {Drawer} from '~/components';

import {CollectionFilterDropdown} from './CollectionFilterDropdown';
import {CollectionFiltersSummary} from './CollectionFiltersSummary';
import type {CollectionMobileFiltersProps} from './CollectionFilters.types';
import {useCollectionFilters} from './useCollectionFilters';

export function CollectionMobileFilters({
  mobileFiltersOpen,
  setMobileFiltersOpen,
  swatchesMap,
}: CollectionMobileFiltersProps) {
  const {activeFilterValues, addFilter, clearFilters, filters, removeFilter} =
    useCollectionFilters();

  const totalFilters = activeFilterValues.length;

  return (
    <Drawer
      ariaName="cart drawer"
      className="md:hidden"
      heading="Filters"
      onClose={() => setMobileFiltersOpen(false)}
      open={mobileFiltersOpen}
      openFrom="right"
    >
      <div className="sticky top-0 z-[1] border-b border-border bg-background p-4 pt-5">
        <div className="mb-4 flex justify-between gap-2">
          <h3 className="text-nav">
            Filters Summary{' '}
            <span className="text-xs">
              {totalFilters ? `(${totalFilters})` : ''}
            </span>
          </h3>

          {totalFilters > 0 && (
            <button
              className="text-xs underline underline-offset-2"
              onClick={clearFilters}
              type="button"
            >
              Clear
            </button>
          )}
        </div>

        <div className="scrollbar-hide max-h-[4.5rem] min-h-8 overflow-y-auto">
          {totalFilters ? (
            <CollectionFiltersSummary hideClear />
          ) : (
            <p className="text-sm leading-8 text-mediumDarkGray">
              No filters selected yet
            </p>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ul className="scrollbar-hide relative h-full overflow-y-auto">
          {filters.map((filter, index) => {
            if (!filter.values.length) return null;

            return (
              <li key={index}>
                <CollectionFilterDropdown
                  activeFilterValues={activeFilterValues}
                  addFilter={addFilter}
                  defaultOpen
                  filter={filter}
                  removeFilter={removeFilter}
                  swatchesMap={swatchesMap}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </Drawer>
  );
}

CollectionMobileFilters.displayName = 'CollectionMobileFilters';
