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
  selectedBundle:
    | {
        size: number;
        title: string;
      }
    | undefined;
}) {
  const bundleSize = useMemo(
    () => selectedBundle?.size || 0,
    [selectedBundle?.size],
  );

  const bundleTitle = useMemo(
    () => selectedBundle?.title || '',
    [selectedBundle?.title],
  );

  const progressPercentage = useMemo(() => {
    if (!bundleSize) return 0;
    return Math.round((selectedCount / bundleSize) * 100);
  }, [bundleSize, selectedCount]);

  return (
    <div className={cn('', className)}>
      <div className="flex items-center justify-between bg-secondary p-4">
        <div className="grow px-6 py-2">
          <div className="mb-1 flex justify-between">
            <span>{bundleTitle}</span>
            <span>
              {selectedCount} of {bundleSize} selected
            </span>
            <span className="text-lg font-semibold">
              {Math.round(progressPercentage)}% complete
            </span>
          </div>
          <Progress value={progressPercentage} className="h-4" />
        </div>
        <div className="">
          <Button onClick={() => viewBundleSelection}>View Selected</Button>
        </div>
      </div>
    </div>
  );
}
