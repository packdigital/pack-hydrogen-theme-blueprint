import {ProductVariant} from '@shopify/hydrogen-react/storefront-api-types';
import {Gift} from 'lucide-react';
import {tierMapToVariants} from 'modules/brilliant/BuildYourOwnPack/BYOPUtilities';
import {useMemo} from 'react';

import {Card, CardContent} from '~/components/ui/card';
import {cn} from '~/lib/utils';

export function DesktopBundleSelector({
  className,
  selectedBundle,
  availableBundles,
  onBundleSelect,
}: {
  className: string;
  selectedBundle: ProductVariant | undefined;
  availableBundles: ProductVariant[];
  onBundleSelect: (variant: ProductVariant) => void;
}) {
  const mappedVariants = useMemo(() => {
    return availableBundles.map((variant) => ({
      ...variant,
      isSelected: variant.title === selectedBundle?.title,
    }));
  }, [availableBundles, selectedBundle]);

  const selectedBundleId = useMemo(
    () => selectedBundle?.id || undefined,
    [selectedBundle?.id],
  );

  return (
    <section className="mx-auto hidden justify-center md:container md:block">
      <div className={cn('', className)}>
        <div className="grid gap-4 md:grid-cols-3 ">
          {mappedVariants.map((bundle, index) => (
            <BundleOption
              bundle={bundle}
              key={index}
              selectedBundledId={selectedBundleId}
              onBundleSelect={onBundleSelect}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function BundleOption({
  bundle,
  key,
  selectedBundledId,
  onBundleSelect,
}: {
  bundle: ProductVariant;
  key: number;
  selectedBundledId: string | undefined;
  onBundleSelect: (bundle: ProductVariant) => void;
}) {
  const bundleDetails = useMemo(() => {
    return {
      title: tierMapToVariants[Number(bundle.title)].title,
      size: tierMapToVariants[Number(bundle.title)].size,
      savings: tierMapToVariants[Number(bundle.title)].savings,
    };
  }, [bundle.title]);

  return (
    <Card
      key={key}
      className={`cursor-pointer transition-all hover:border-primary ${
        selectedBundledId === bundle.id
          ? 'border-primary ring-2 ring-primary'
          : ''
      }`}
      onClick={() => onBundleSelect(bundle)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onBundleSelect(bundle);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 shrink-0 rounded-full bg-primary/10 p-2">
            <Gift className="size-10 text-primary" />
          </div>
          <div className="flex-1">
            <div className="mb-1 flex items-center justify-between">
              <h3 className="text-base font-bold">{bundleDetails.title}</h3>
            </div>
            <div className="mb-1 flex items-baseline gap-1">
              <span className="text-xl font-bold">${bundle.price.amount}</span>
              <span className="text-sm font-medium !text-green-600">
                Save ${bundleDetails.savings}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {bundle.selectedOptions[0].value} adorable pets included
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
