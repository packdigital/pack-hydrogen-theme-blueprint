import {ProductVariant} from '@shopify/hydrogen-react/storefront-api-types';

import {cn} from '~/lib/utils';

export function MobileBundleSelector({
  className,
  selectedBundle,
}: {
  className: string;
  selectedBundle: ProductVariant | undefined;
}) {
  return (
    <div className={cn('', className)}>
      <div className="flex items-center justify-between bg-secondary p-4">
        <div className="px-6 py-2">Tiers</div>
      </div>
    </div>
  );
}
