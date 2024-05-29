import {useCallback, useEffect, useMemo, useState} from 'react';
import {useCart} from '@shopify/hydrogen-react';

import {LoadingDots} from '~/components';
import {useGlobal} from '~/hooks';

import type {BYOBAddToCartProps} from './BuildYourOwnBundle.types';

export function BYOBAddToCart({
  addToCartUnlocked,
  bundle,
  total,
}: BYOBAddToCartProps) {
  const {error, linesAdd, id: cartId, status} = useCart();
  const {openCart} = useGlobal();

  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const cartIsUpdating = status === 'creating' || status === 'updating';

  const linesToAddByVariantId = useMemo(() => {
    return bundle.reduce(
      (
        acc: Record<string, {merchandiseId: string; quantity: number}>,
        variant,
      ) => {
        if (acc[variant.id]) {
          return {
            ...acc,
            [variant.id]: {
              ...acc[variant.id],
              quantity: acc[variant.id].quantity + 1,
            },
          };
        }
        return {
          ...acc,
          [variant.id]: {
            merchandiseId: variant.id,
            quantity: 1,
          },
        };
      },
      {},
    );
  }, [bundle?.length]);

  const handleAddToCart = useCallback(() => {
    if (!addToCartUnlocked || isAdding || cartIsUpdating) return;
    setIsAdding(true);

    const items = Object.values(linesToAddByVariantId);

    linesAdd(items);
  }, [
    bundle,
    addToCartUnlocked,
    isAdding,
    linesAdd,
    linesToAddByVariantId,
    status,
  ]);

  useEffect(() => {
    if (isAdding && status === 'idle') {
      setIsAdding(false);
      setIsAdded(true);
      openCart();
      setTimeout(() => setIsAdded(false), 1000);
    }
  }, [cartId, status, linesToAddByVariantId, isAdding]);

  useEffect(() => {
    if (!error) return;
    console.error('@shopify/hydrogen-react:useCart', error);
  }, [error]);

  return (
    <button
      aria-label="Add bundle to cart"
      disabled={!addToCartUnlocked}
      className="btn-primary w-full"
      onClick={handleAddToCart}
      type="button"
    >
      {!isAdding && !isAdded && `Add To Cart${total ? ` - ${total}` : ''}`}

      {isAdding && (
        <span aria-label="Adding to cart" aria-live="assertive" role="status">
          <LoadingDots />
        </span>
      )}

      {isAdded && (
        <span aria-live="assertive" role="status">
          Added To Cart
        </span>
      )}
    </button>
  );
}

BYOBAddToCart.displayName = 'BYOBAddToCart';
