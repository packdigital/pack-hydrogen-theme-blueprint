import {useEffect, useMemo, useState} from 'react';
import {useInView} from 'react-intersection-observer';
import type {ProductVariant} from '@shopify/hydrogen-react/storefront-api-types';

import {COLOR_OPTION_NAME} from '~/lib/constants';
import {useProductByHandle} from '~/hooks';

import type {BYOBProductItemProps} from './BYOBProductItem.types';
import {BYOBQuickShop} from './BYOBQuickShop';
import {BYOBProductItemMedia} from './BYOBProductItemMedia';

export function BYOBProductItem({
  bundle,
  bundleMapById,
  handle,
  index,
  incrementDisabled,
  handleRemoveFromBundle,
  handleAddToBundle,
}: BYOBProductItemProps) {
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
        ?.values?.[0] || null
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
  const isSecondCol = index % 2 === 1;
  const isThirdCol = index % 3 === 2;
  const isFourthCol = index % 4 === 3;

  useEffect(() => {
    if (!product) return;
    setSelectedVariant(product?.variants?.nodes?.[0]);
  }, [product?.id]);

  // grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4

  return (
    <div
      className={`flex h-full flex-col border-b border-border ${
        isSecondCol ? '' : 'max-sm:border-r md:max-lg:border-r'
      } ${isThirdCol ? '' : 'sm:max-md:border-r lg:max-xl:border-r'} ${
        isFourthCol ? '' : 'xl:border-r'
      }`}
      ref={ref}
    >
      <BYOBProductItemMedia
        media={product?.media?.nodes}
        productTitle={product?.title}
      />

      <div className="flex flex-1 flex-col justify-between gap-2.5 px-2.5 pb-5 pt-2.5">
        <div className="text-center">
          <h3 className="text-h5">{product?.title}</h3>

          {primaryOptionValue && (
            <p className="text-sm">{primaryOptionValue}</p>
          )}
        </div>

        <div className="flex min-h-12 w-full flex-col items-center">
          {isSoldOut ? (
            <button
              disabled
              type="button"
              className="btn-primary !h-12 !py-0 text-sm"
            >
              Sold Out
            </button>
          ) : (
            <BYOBQuickShop
              bundle={bundle}
              bundleMapById={bundleMapById}
              incrementDisabled={incrementDisabled}
              handleRemoveFromBundle={handleRemoveFromBundle}
              handleAddToBundle={handleAddToBundle}
              product={product}
              selectedVariant={selectedVariant}
            />
          )}
        </div>
      </div>
    </div>
  );
}

BYOBProductItem.displayName = 'BYOBProductItem';
