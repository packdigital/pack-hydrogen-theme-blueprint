import {MappedSelectedBundle} from '../../BuildYourOwnPack';

import {cn} from '~/lib/utils';

export function MobileBundleSelector({
  className,
  selectedBundle,
}: {
  className: string;
  selectedBundle: MappedSelectedBundle | undefined;
}) {
  return (
    <div className={cn('', className)}>
      <div className="flex items-center justify-between bg-secondary p-4">
        <div className="px-6 py-2">Tiers</div>
      </div>
    </div>
  );
}
