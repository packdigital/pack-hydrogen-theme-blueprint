import type {ProductVariant} from '@shopify/hydrogen-react/storefront-api-types';
import {useEffect, useMemo, useState} from 'react';
import {useInView} from 'react-intersection-observer';

import type {BYOPProductItemProps} from './BYOPProductItem.types';
import {BYOPProductItemMedia} from './BYOPProductItemMedia';
import {BYOPQuickShop} from './BYOPQuickShop';

import {Button} from '~/components/ui/button';
import {Card, CardContent} from '~/components/ui/card';
import {useProductByHandle} from '~/hooks';
import {COLOR_OPTION_NAME} from '~/lib/constants';

export function BYOPProductItem({
  bundle,
  bundleMapById,
  handle,
  index,
  incrementDisabled,
  handleRemoveFromBundle,
  handleAddToBundle,
}: BYOPProductItemProps) {
  const {ref, inView} = useInView({
    rootMargin: '400px',
    triggerOnce: true,
  });
  const product = useProductByHandle(handle, inView);

  const [selectedVariant, setSelectedVariant] = useState<
    ProductVariant | undefined
  >(product?.variants?.nodes?.[0]);

  const primaryOptionValue = useMemo(() => {
    if (!product) return null;
    return (
      product.options.find((option) => option.name === COLOR_OPTION_NAME)
        ?.optionValues?.[0] || null
    );
  }, [product]);

  const isSoldOut = useMemo(() => {
    return (
      !!product &&
      product.variants.nodes.every((variant) => !variant.availableForSale)
    );
  }, [product]);

  /* Default BYOB item logic only set up for selecting the first variant
   * if an options selector is needed, change selectedVariant to a useState and add in an options selector below
   */

  useEffect(() => {
    if (!product) return;
    setSelectedVariant(product?.variants?.nodes?.[0]);
  }, [product]);

  return (
    <Card className={`flex h-full flex-col overflow-hidden`} ref={ref}>
      <div className="p-2">
        <BYOPProductItemMedia
          media={product?.media?.nodes}
          productTitle={product?.title}
        />
      </div>
      <CardContent className="p-2 md:p-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium">{product?.title}</h3>
          <BYOPQuickShop
            bundle={bundle}
            bundleMapById={bundleMapById}
            incrementDisabled={incrementDisabled}
            handleRemoveFromBundle={handleRemoveFromBundle}
            handleAddToBundle={handleAddToBundle}
            product={product}
            selectedVariant={selectedVariant}
          />
        </div>
      </CardContent>
    </Card>
  );
}

BYOPProductItem.displayName = 'BYOPProductItem';
