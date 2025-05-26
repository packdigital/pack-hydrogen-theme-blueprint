import {useMemo} from 'react';

import {Button} from '~/components/ui/button';

export function GridHeader({
  randomLoading,
  fillRandomly,
  selectedItemsLength,
  totalItems,
  itemsPerPage,
  currentPage,
  bundleSize,
}: {
  randomLoading: boolean;
  fillRandomly: () => void;
  selectedItemsLength: number;
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  bundleSize: number;
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
    <div className="mb-4 flex items-center justify-between">
      {/* View Selected */}

      {/* Random Fill*/}
      <Button
        type="button"
        onClick={fillRandomly}
        disabled={randomLoading || selectedItemsLength >= bundleSize}
      >
        {randomLoading ? 'Filling...' : 'Random Fill'}
      </Button>

      <div className="flex w-full flex-row items-center justify-between">
        {/* Results summary */}
        {totalItems > 0 && (
          <div className="mb-2 w-full text-right text-sm text-muted-foreground ">
            Showing {startItem}-{endItem} of {totalItems} pets
          </div>
        )}
      </div>
    </div>
  );
}
