import {useCallback, useEffect, useMemo, useState} from 'react';
import {useCart} from '@shopify/hydrogen-react';
import clsx from 'clsx';

import {LoadingDots} from '~/components/Animations';
import {useMenu} from '~/hooks';

import type {BYOBAddToCartProps} from './BuildYourOwnBundle.types';

export function BYOBAddToCart({
  addToCartUnlocked,
  bundle,
  total,
}: BYOBAddToCartProps) {
  const {error, linesAdd, id: cartId, status} = useCart();
  const {openCart} = useMenu();

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
      <span className={clsx(isAdding || isAdded ? 'invisible' : 'visible')}>
        {`Add To Cart${total ? ` - ${total}` : ''}`}
      </span>

      {isAdding && (
        <LoadingDots
          status="Adding to cart"
          withAbsolutePosition
          withStatusRole
        />
      )}

      {isAdded && (
        <span aria-live="assertive" className="absolute-center" role="status">
          Added To Cart
        </span>
      )}
    </button>
  );
}

BYOBAddToCart.displayName = 'BYOBAddToCart';
