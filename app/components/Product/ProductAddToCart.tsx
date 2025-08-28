import {useCallback, useEffect, useMemo} from 'react';

import {AddToCart} from '~/components/AddToCart';
import {QuantitySelector} from '~/components/QuantitySelector';

import type {ProductAddToCartProps} from './Product.types';

export function ProductAddToCart({
  enabledQuantitySelector,
  quantity = 1,
  selectedVariant,
  setQuantity,
}: ProductAddToCartProps) {
  const {
    increment = 1,
    minimum = 1,
    maximum,
  } = {...selectedVariant?.quantityRule};

  const {disableDecrement, disableIncrement} = useMemo(() => {
    const nextIncrement = increment - (quantity % increment);
    const prevIncrement =
      quantity % increment === 0 ? increment : quantity % increment;
    const prevQuantity = Number(
      Math.max(0, quantity - prevIncrement).toFixed(0),
    );
    const nextQuantity = Number((quantity + nextIncrement).toFixed(0));
    return {
      disableDecrement: prevQuantity < minimum,
      disableIncrement: Boolean(maximum && nextQuantity > maximum),
    };
  }, [increment, minimum, maximum, quantity, selectedVariant?.id]);

  const handleDecrement = useCallback(() => {
    if (disableDecrement) return;
    setQuantity(quantity - increment);
  }, [quantity, increment, disableDecrement]);

  const handleIncrement = useCallback(() => {
    if (disableIncrement) return;
    setQuantity(quantity + increment);
  }, [quantity, increment, disableIncrement]);

  useEffect(() => {
    if (!enabledQuantitySelector) return undefined;
    return () => {
      setQuantity(increment);
    };
  }, [enabledQuantitySelector]);

  return (
    <div className="flex w-full items-center gap-4">
      {enabledQuantitySelector && (
        <QuantitySelector
          disableDecrement={disableDecrement}
          disableIncrement={disableIncrement}
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
