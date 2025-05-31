import {useMoney} from '@shopify/hydrogen-react';
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
    <section className="mx-auto justify-center md:block">
      <h3 className="mb-4 text-left text-3xl font-semibold text-gray-900">
        1. Choose Your Pack Size:
      </h3>
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

  const bundlePrice = useMoney({
    amount: bundle?.price?.amount || '0.00',
    currencyCode: bundle.price?.currencyCode || 'USD',
  });

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
        {/* Row 1: Icon, Title, Price */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="shrink-0 rounded-full bg-blue-100 p-2">
            <Gift className="size-8 text-blue-600" />
          </div>
          <h3 className="min-w-0 flex-1 break-words text-2xl text-gray-900">
            {bundleDetails.title}
          </h3>
          <span className="shrink-0 text-2xl font-bold text-green-800">
            {bundlePrice.localizedString}
          </span>
        </div>
        {/* Row 2: Remaining content, left justified */}
        <div className="flex flex-col items-center">
          <h4 className="text-xl text-gray-600">
            ✔ {bundle.selectedOptions[0].value} adorable pets included
          </h4>
          <p className="text-xs text-gray-500"></p>
          <div className="mb-1 flex flex-col items-baseline gap-1">
            <span className="text-base font-medium text-green-600">
              💰 Save {bundleDetails.savings} {bundleDetails.savingsText}
            </span>
          </div>
          <div className="mb-1 flex items-baseline gap-1">
            <div className="text-sm font-medium text-gray-600">
              {bundleDetails.tagline}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
