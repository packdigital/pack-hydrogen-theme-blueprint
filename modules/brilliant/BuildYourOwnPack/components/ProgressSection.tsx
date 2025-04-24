import {ProductVariant} from '@shopify/hydrogen-react/storefront-api-types';
import {CircleArrowRight} from 'lucide-react';
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
      <DesktopProgressSection
        selectedCount={selectedCount}
        bundleSize={bundleSize}
        progressPercentage={progressPercentage}
        viewBundleSelection={viewBundleSelection}
      />
      <MobileProgressSection
        selectedCount={selectedCount}
        bundleSize={bundleSize}
        progressPercentage={progressPercentage}
        viewBundleSelection={viewBundleSelection}
      />
    </div>
  );
}

export function DesktopProgressSection({
  selectedCount,
  bundleSize,
  progressPercentage,
  viewBundleSelection,
}: {
  selectedCount: number;
  bundleSize: number;
  progressPercentage: number;
  viewBundleSelection: (val: boolean) => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 hidden w-full justify-center md:flex">
      <div className="flex w-1/3 flex-col rounded-t-lg border-x-2 border-t-2 border-blue-500 bg-gray-100 shadow-lg">
        <div className="flex items-center justify-between gap-4 p-2">
          <div className="grow px-6 py-1">
            <div className="mb-1 flex items-end justify-between gap-2 text-sm ">
              <span className="font-semibold text-gray-900">
                Your Selection: {selectedCount} of {bundleSize}
              </span>
              <span className="font-semibold text-gray-900">
                {Math.round(progressPercentage)}% complete
              </span>
            </div>
            <Progress
              value={progressPercentage}
              className="h-4 w-full overflow-hidden rounded-md bg-gray-300"
            />
          </div>
          <div className="flex justify-center">
            <Button
              size="sm"
              onClick={() => viewBundleSelection(true)}
              className=""
            >
              Review Your Pack <CircleArrowRight className="size-8" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MobileProgressSection({
  selectedCount,
  bundleSize,
  progressPercentage,
  viewBundleSelection,
}: {
  selectedCount: number;
  bundleSize: number;
  progressPercentage: number;
  viewBundleSelection: (val: boolean) => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t-2 border-blue-500 shadow-lg md:hidden ">
      <div className="flex flex-wrap items-center justify-between gap-1 bg-gray-100 p-2">
        <div className="grow p-2">
          <div className="mb-1 flex flex-wrap items-end justify-between gap-1 text-sm ">
            <span className="font-semibold">
              Your Selection: {selectedCount} of {bundleSize}
            </span>
            <span className="font-semibold">
              {Math.round(progressPercentage)}% complete
            </span>
          </div>
          <Progress
            value={progressPercentage}
            className="h-4 w-full overflow-hidden rounded-md bg-gray-300"
          />
        </div>
        <div className="flex w-full justify-center">
          <Button
            onClick={() => viewBundleSelection(true)}
            className="mb-2"
            size="sm"
          >
            Review Your Pack <CircleArrowRight className="size-8" />
          </Button>
        </div>
      </div>
    </div>
  );
}
