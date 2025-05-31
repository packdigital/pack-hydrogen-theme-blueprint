import {useMoney} from '@shopify/hydrogen-react';
import {ProductVariant} from '@shopify/hydrogen-react/storefront-api-types';
import {UseMoneyValue} from '@shopify/hydrogen-react/useMoney';
import {CircleArrowRight, CircleXIcon, GiftIcon} from 'lucide-react';
import {useMemo} from 'react';

import {tierMapToVariants} from '../BYOPUtilities';

import {Button} from '~/components/ui/button';
import {Progress} from '~/components/ui/progress';
import {cn} from '~/lib/utils';

export function ProgressSection({
  className,
  viewBundleSelection,
  selectedCount,
  selectedBundle,
  fillRandomly,
  randomLoading,
  selectedItemsLength,
  handleClear,
}: {
  className?: string;
  viewBundleSelection: (val: boolean) => void;
  selectedCount: number;
  selectedBundle: ProductVariant | undefined;
  fillRandomly: () => void;
  randomLoading: boolean;
  selectedItemsLength: number;
  handleClear?: () => void;
}) {
  const bundlePrice = useMoney({
    amount: selectedBundle?.price.amount || '0.00',
    currencyCode: selectedBundle?.price.currencyCode || 'USD',
  });

  const bundleSize = useMemo(
    () => Number(selectedBundle?.selectedOptions[0].value) || 0,
    [selectedBundle?.selectedOptions],
  );

  const bundleName = useMemo(
    () => tierMapToVariants[bundleSize]?.title || 'Your Bundle',
    [bundleSize],
  );

  const progressPercentage = useMemo(() => {
    if (!bundleSize) return 0;
    return Math.round((selectedCount / bundleSize) * 100);
  }, [bundleSize, selectedCount]);

  console.log('ProgressSection', selectedBundle);

  return (
    <div className={cn('w-full ', className)}>
      <DesktopProgressSection
        selectedCount={selectedCount}
        bundleSize={bundleSize}
        progressPercentage={progressPercentage}
        viewBundleSelection={viewBundleSelection}
        fillRandomly={fillRandomly}
        randomLoading={randomLoading}
        selectedItemsLength={selectedItemsLength}
        bundleName={bundleName}
        bundlePrice={bundlePrice}
        handleClear={handleClear}
      />
      <MobileProgressSection
        selectedCount={selectedCount}
        bundleSize={bundleSize}
        progressPercentage={progressPercentage}
        viewBundleSelection={viewBundleSelection}
        fillRandomly={fillRandomly}
        randomLoading={randomLoading}
        selectedItemsLength={selectedItemsLength}
      />
    </div>
  );
}

export function DesktopProgressSection({
  selectedCount,
  bundleSize,
  bundleName,
  bundlePrice,
  progressPercentage,
  viewBundleSelection,
  fillRandomly,
  randomLoading,
  selectedItemsLength,
  handleClear,
}: {
  selectedCount: number;
  bundleSize: number;
  bundleName: string;
  bundlePrice: UseMoneyValue;
  progressPercentage: number;
  viewBundleSelection: (val: boolean) => void;
  fillRandomly: () => void;
  randomLoading: boolean;
  selectedItemsLength: number;
  handleClear?: () => void;
}) {
  const isComplete = useMemo(() => {
    return progressPercentage === 100;
  }, [progressPercentage]);

  const notStarted = useMemo(() => {
    return selectedCount === 0 && bundleSize > 0;
  }, [selectedCount, bundleSize]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 hidden w-full justify-center md:flex">
      <div className="mx-8 flex w-full flex-col rounded-t-lg border-x-2 border-t-2 border-blue-500 bg-white shadow-lg xl:max-w-7xl ">
        <div className="flex items-center justify-between gap-4 p-2">
          {/*1st Column */}
          <div className="flex items-center gap-4">
            <GiftIcon className="size-8 text-blue-600" />
            <div className="flex flex-col">
              <div>
                <p className="text-h3 text-lg ">{bundleName}</p>
              </div>
              <div>
                <p className="text-h3 text-lg text-gray-500">
                  {selectedCount} of {bundleSize} selected
                </p>
              </div>
            </div>
          </div>
          {/*2nd Column */}
          <div className="flex grow items-center gap-4">
            <Progress
              value={progressPercentage}
              className="h-4 w-full overflow-hidden rounded-md bg-gray-300"
            />
          </div>
          {/*3rd Column */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <p className="text-h3 text-gray-500">Total</p>
              <p>{bundlePrice.localizedString}</p>
            </div>
            <Button
              size={'sm'}
              variant={'outline'}
              type="button"
              onClick={fillRandomly}
              disabled={randomLoading || selectedItemsLength >= bundleSize}
              className="border-gray-400"
            >
              {randomLoading ? 'Filling...' : 'Random Fill'}
            </Button>
          </div>
          {/*4th Column */}
          <div className="flex items-center gap-4">
            <Button
              size="sm"
              variant={'outline'}
              onClick={handleClear}
              className="border-gray-400"
              disabled={notStarted}
            >
              <CircleXIcon className="size-8" />
              <span className="break-words">Clear</span>
            </Button>

            <Button
              size="sm"
              onClick={() => viewBundleSelection(true)}
              className={`h-auto flex-wrap py-2 ${isComplete ? 'bg-green-600 text-white hover:bg-green-700' : ''}`}
            >
              <span className="break-words">
                {isComplete ? 'Finalize your pack' : 'Review Your Pack'}
              </span>
              <CircleArrowRight className="size-8" />
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
  fillRandomly,
  randomLoading,
  selectedItemsLength,
}: {
  selectedCount: number;
  bundleSize: number;
  progressPercentage: number;
  viewBundleSelection: (val: boolean) => void;
  fillRandomly: () => void;
  randomLoading: boolean;
  selectedItemsLength: number;
}) {
  const isComplete = useMemo(() => {
    return progressPercentage === 100;
  }, [progressPercentage]);

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
        <div className="flex w-full justify-center gap-3">
          <Button
            size={'sm'}
            variant={'outline'}
            type="button"
            onClick={fillRandomly}
            disabled={randomLoading || selectedItemsLength >= bundleSize}
            className="border-gray-400"
          >
            {randomLoading ? 'Filling...' : 'Random Fill'}
          </Button>

          <Button
            onClick={() => viewBundleSelection(true)}
            className={`mb-2 ${isComplete ? 'bg-green-600 text-white hover:bg-green-700' : ''}`}
            size="sm"
          >
            {isComplete ? 'Finalize your pack' : 'Review Your Pack'}{' '}
            <CircleArrowRight className="size-8" />
          </Button>
        </div>
      </div>
    </div>
  );
}
