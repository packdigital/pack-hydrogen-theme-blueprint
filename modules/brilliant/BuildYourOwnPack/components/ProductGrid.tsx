import {ProductVariant} from '@shopify/hydrogen-react/storefront-api-types';
import {Check, CircleCheckBig, Plus} from 'lucide-react';
import {
  BundleMapById,
  ProductGrouping,
} from 'modules/brilliant/BuildYourOwnPack/BuildYourOwnPack.types';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {useInView} from 'react-intersection-observer';

import {BYOPProductItemMedia} from '../BYOPProductItem/BYOPProductItemMedia';
import {BYOPQuickShop} from '../BYOPProductItem/BYOPQuickShop';

import {Card, CardContent} from '~/components/ui/card';
import {useProductByHandle} from '~/hooks';
import type {ProductCms} from '~/lib/types';
import {cn} from '~/lib/utils';

export function ProductGrid({
  products,
  selectedCount,
  selectedBundle,
  bundleProducts,
  bundleMapById,
  incrementDisabled,
  handleRemoveFromBundle,
  handleAddToBundle,
  className,
}: {
  products: ProductCms[];
  selectedCount?: number;
  selectedBundle?: ProductVariant | undefined;
  bundleProducts: ProductVariant[];
  bundleMapById: BundleMapById;
  incrementDisabled: boolean;
  handleRemoveFromBundle: (id: string) => void;
  handleAddToBundle: (product: ProductVariant) => void;
  className?: string;
}) {
  // Ensure products is always an array
  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <div className={cn('w-full', className)}>
      <div className="w-full">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5">
          {safeProducts.map((product, index) => (
            <ProductCard
              key={product?.id || index}
              handle={product?.handle || ''}
              bundle={bundleProducts}
              bundleMapById={bundleMapById}
              incrementDisabled={incrementDisabled}
              handleRemoveFromBundle={handleRemoveFromBundle}
              handleAddToBundle={handleAddToBundle}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProductCard({
  handle,
  bundle,
  bundleMapById,
  incrementDisabled,
  handleRemoveFromBundle,
  handleAddToBundle,
}: {
  handle: string;
  bundle: ProductVariant[];
  bundleMapById: BundleMapById;
  incrementDisabled: boolean;
  handleRemoveFromBundle: (id: string) => void;
  handleAddToBundle: (product: ProductVariant) => void;
}) {
  const {ref, inView} = useInView({
    rootMargin: '400px',
    triggerOnce: true,
  });
  const product = useProductByHandle(handle, inView);

  const [selectedVariant, setSelectedVariant] = useState<
    ProductVariant | undefined
  >(product?.variants?.nodes?.[0]);

  useEffect(() => {
    if (!product) return;
    setSelectedVariant(product?.variants?.nodes?.[0]);
  }, [product]);

  const isSelected = useMemo(() => {
    return !!bundle.find(({id}) => selectedVariant?.id === id);
  }, [bundle, selectedVariant]);

  if (!handle) return null;

  return (
    <Card
      className={`flex h-full flex-col overflow-hidden rounded-md transition-all ${
        isSelected
          ? 'border-2 border-blue-600 ring-2 ring-blue-600 '
          : 'border-gray-200'
      }`}
      ref={ref}
    >
      <div className="p-2">
        <div className="relative">
          {isSelected && (
            <CircleCheckBig className="absolute right-2 top-2 z-10 size-8 rounded-full bg-primary text-white " />
          )}
          {product?.media?.nodes && product.media.nodes.length > 0 && (
            <BYOPProductItemMedia
              media={product.media.nodes}
              productTitle={product?.title || ''}
            />
          )}
        </div>
      </div>
      <CardContent className="p-2 md:p-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium text-gray-900">
            {product?.title || ''}
          </h3>

          <BYOPQuickShop
            bundle={bundle}
            bundleMapById={bundleMapById}
            handleAddToBundle={handleAddToBundle}
            handleRemoveFromBundle={handleRemoveFromBundle}
            incrementDisabled={incrementDisabled}
            product={product}
            selectedVariant={selectedVariant}
          />
        </div>
      </CardContent>
    </Card>
  );
}
