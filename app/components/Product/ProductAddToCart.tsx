import {useCallback, useEffect} from 'react';

import {AddToCart} from '~/components/AddToCart';
import {QuantitySelector} from '~/components/QuantitySelector';

import type {ProductAddToCartProps} from './Product.types';

export function ProductAddToCart({
  enabledQuantitySelector,
  quantity = 1,
  selectedVariant,
  setQuantity,
}: ProductAddToCartProps) {
  const handleDecrement = useCallback(() => {
    if (quantity === 1) return;
    setQuantity(quantity - 1);
  }, [quantity]);

  const handleIncrement = useCallback(() => {
    setQuantity(quantity + 1);
  }, [quantity]);

  useEffect(() => {
    if (!enabledQuantitySelector) return undefined;
    return () => {
      setQuantity(1);
    };
  }, [enabledQuantitySelector]);

  return (
    <div className="flex w-full items-center gap-4">
      {enabledQuantitySelector && (
        <QuantitySelector
          disableDecrement={quantity === 1}
          handleDecrement={handleDecrement}
          handleIncrement={handleIncrement}
          productTitle={selectedVariant?.product?.title}
          quantity={quantity}
        />
      )}

      <div className="flex-1">
        <AddToCart
          isPdp
          quantity={quantity}
          selectedVariant={selectedVariant}
        />
      </div>
    </div>
  );
}

ProductAddToCart.displayName = 'ProductAddToCart';
