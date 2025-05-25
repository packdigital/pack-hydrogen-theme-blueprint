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
  className?: string;
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
    <section className="mx-auto justify-center md:container md:block">
      <div className={cn('w-full', className)}>
        <div className="grid gap-4 md:grid-cols-3">
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
  selectedBundledId,
  onBundleSelect,
}: {
  bundle: ProductVariant;
  selectedBundledId: string | undefined;
  onBundleSelect: (bundle: ProductVariant) => void;
}) {
  const bundleDetails = useMemo(() => {
    return {
      title: tierMapToVariants[Number(bundle.title)].title,
      size: tierMapToVariants[Number(bundle.title)].size,
      savings: tierMapToVariants[Number(bundle.title)].savings,
      savingsText: tierMapToVariants[Number(bundle.title)].savingsText,
      tagline: tierMapToVariants[Number(bundle.title)].tagline,
    };
  }, [bundle.title]);

  const isSelected = selectedBundledId === bundle.id;

  return (
    <Card
      className={`cursor-pointer overflow-hidden rounded-md border transition-all hover:border-blue-600  ${
        isSelected
          ? 'border-2 border-blue-600 ring-2 ring-blue-600 '
          : 'border-gray-200'
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
          <div className="mt-1 shrink-0 rounded-full bg-blue-100 p-2 ">
            <Gift className="size-10 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-0 ">
              <h3 className="text-2xl text-gray-900">{bundleDetails.title}</h3>
              <span className="text-2xl font-bold text-green-800">
                ${bundle.price.amount}
              </span>
            </div>
            <h4 className="flex text-xl text-gray-600">
              ✔ {bundle.selectedOptions[0].value} adorable pets included
            </h4>
            <p className="text-xs text-gray-500"></p>

            <div className="mb-1 flex flex-col items-baseline gap-1 ">
              <span className="text-base font-medium text-green-600">
                💰 Save {bundleDetails.savings} {bundleDetails.savingsText}
              </span>
            </div>

            <div className="mb-1 flex w-full items-baseline gap-1">
              <div className="text-sm font-medium text-gray-600">
                {bundleDetails.tagline}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
