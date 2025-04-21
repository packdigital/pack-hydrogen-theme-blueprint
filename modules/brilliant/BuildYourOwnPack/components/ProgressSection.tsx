import {ProductVariant} from '@shopify/hydrogen-react/storefront-api-types';
import {useMemo} from 'react';

import {Button} from '~/components/ui/button';
import {Progress} from '~/components/ui/progress';
import {cn} from '~/lib/utils';

export function ProgressSection({
  className,
  viewBundleSelection,
  selectedCount,
  selectedBundle,
}: {
  className?: string;
  viewBundleSelection: (val: boolean) => void;
  selectedCount: number;
  selectedBundle: ProductVariant | undefined;
}) {
  const bundleSize = useMemo(
    () => Number(selectedBundle?.selectedOptions[0].value) || 0,
    [selectedBundle?.selectedOptions],
  );

  const progressPercentage = useMemo(() => {
    if (!bundleSize) return 0;
    return Math.round((selectedCount / bundleSize) * 100);
  }, [bundleSize, selectedCount]);

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between rounded-md bg-gray-100 p-4">
        <div className="grow px-6 py-2">
          <div className="mb-1 flex justify-between">
            <span className="font-semibold text-gray-900">
              Your Selection: {selectedCount} of {bundleSize}
            </span>
            <span className="text-lg font-semibold text-gray-900">
              {Math.round(progressPercentage)}% complete
            </span>
          </div>
          <Progress
            value={progressPercentage}
            className="h-4 w-full overflow-hidden rounded-md bg-gray-200"
          />
        </div>
        <div>
          <Button
            onClick={() => viewBundleSelection(true)}
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            View Selected Items
          </Button>
        </div>
      </div>
    </div>
  );
}
