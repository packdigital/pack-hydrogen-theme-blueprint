import {useMemo} from 'react';

import {ToggleGroup, ToggleGroupItem} from '~/components/ui/toggle-group'; // Adjust import path as needed

export function GridHeader({
  totalItems,
  itemsPerPage,
  currentPage,

  filter,
  setFilter,
}: {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;

  filter: 'all' | 'selected';
  setFilter: (value: 'all' | 'selected') => void;
}) {
  // Calculate the range of items being displayed
  const startItem = useMemo(
    () => (currentPage - 1) * itemsPerPage + 1,
    [currentPage, itemsPerPage],
  );
  const endItem = useMemo(
    () => Math.min(currentPage * itemsPerPage, totalItems),
    [currentPage, itemsPerPage, totalItems],
  );

  return (
    <>
      {/* Row 1: Title */}
      <h3 className="mb-2 text-left text-3xl font-semibold text-gray-900">
        2. Select Your Jiggle Pets
      </h3>

      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full items-center justify-between gap-2">
            {/* Right column: Pack Actions */}
            <div className="flex items-center gap-2">
              {/* Results summary */}
              <div className="min-w-[140px] text-right text-sm text-muted-foreground">
                {totalItems > 0
                  ? `Showing ${startItem}-${endItem} of ${totalItems} pets`
                  : 'No pets to display'}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold">View:</p>
            <ToggleGroup
              type="single"
              variant={'outline'}
              value={filter}
              onValueChange={(val) => setFilter(val as 'all' | 'selected')}
              aria-label="Product filter"
            >
              <ToggleGroupItem
                variant={'outline'}
                value="all"
                aria-label="Show all products"
                className="border-gray-400"
              >
                All
              </ToggleGroupItem>
              <ToggleGroupItem
                variant={'outline'}
                value="selected"
                aria-label="Show selected products"
                className="border-gray-400"
              >
                Selected
              </ToggleGroupItem>
              {/* Add more ToggleGroupItem for more filters */}
            </ToggleGroup>
          </div>
        </div>
      </div>
    </>
  );
}
