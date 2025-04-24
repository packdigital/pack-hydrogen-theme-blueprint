import {ProductVariant} from '@shopify/hydrogen-react/storefront-api-types';
import {CircleCheck} from 'lucide-react';
import {useEffect, useMemo, useState} from 'react';
import {useInView} from 'react-intersection-observer';

import {BYOPProductItemMedia} from '../../BYOPProductItem/BYOPProductItemMedia';
import {BYOPQuickShop} from '../../BYOPProductItem/BYOPQuickShop';

import {Pagination} from './Pagination';

import {Card, CardContent} from '~/components/ui/card';
import {useProductByHandle} from '~/hooks';
import type {ProductCms} from '~/lib/types';
import {cn} from '~/lib/utils';

export function ProductGrid({
  className,
  products,
  selectedItems,
  incrementDisabled,
  handleRemoveFromBundle,
  handleAddToBundle,
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: {
  className?: string;
  products: ProductCms[];
  selectedItems: ProductVariant[];
  incrementDisabled: boolean;
  handleRemoveFromBundle: (id: string) => void;
  handleAddToBundle: (product: ProductVariant) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}) {
  // Ensure products is always an array
  const safeProducts = Array.isArray(products) ? products : [];

  // Calculate the range of items being displayed
  const startItem = useMemo(
    () => (currentPage - 1) * itemsPerPage + 1,
    [currentPage, itemsPerPage],
  );
  const endItem = useMemo(
    () => Math.min(currentPage * itemsPerPage, totalItems),
    [currentPage, itemsPerPage, totalItems],
  );

  return (
    <div className={cn('w-full', className)}>
      <div className="w-full">
        {/* Results summary */}
        {totalItems > 0 && (
          <div className="mb-2 w-full text-right text-sm text-muted-foreground ">
            Showing {startItem}-{endItem} of {totalItems} pets
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-5">
          {safeProducts.map((product, index) => (
            <ProductCard
              key={product?.id || index}
              handle={product?.handle || ''}
              selectedItems={selectedItems}
              incrementDisabled={incrementDisabled}
              handleRemoveFromBundle={handleRemoveFromBundle}
              handleAddToBundle={handleAddToBundle}
            />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}

export function ProductCard({
  handle,
  selectedItems,
  incrementDisabled,
  handleRemoveFromBundle,
  handleAddToBundle,
}: {
  handle: string;
  selectedItems: ProductVariant[];
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
    return !!selectedItems?.find(({id}) => selectedVariant?.id === id);
  }, [selectedItems, selectedVariant]);

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
            <CircleCheck className="absolute right-1 top-1 z-10 size-8 rounded-full bg-primary text-white " />
          )}

          <BYOPProductItemMedia
            media={product?.media.nodes}
            productTitle={product?.title || ''}
          />
        </div>
      </div>
      <CardContent className="p-0 pb-2">
        <div className="flex flex-col items-center text-center">
          <h3 className="text-base font-medium text-gray-900">
            {product?.title || ''}
          </h3>

          <div className="mt-2">
            <BYOPQuickShop
              selectedItems={selectedItems}
              handleAddToBundle={handleAddToBundle}
              handleRemoveFromBundle={handleRemoveFromBundle}
              incrementDisabled={incrementDisabled}
              product={product}
              selectedVariant={selectedVariant}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
