import {useCallback, useEffect, useMemo, useState} from 'react';
import clsx from 'clsx';

import {LoadingDots} from '~/components/Animations';
import {useCart, useMenu, useRootLoaderData} from '~/hooks';

import type {BYOBAddToCartProps} from './BuildYourOwnBundle.types';

export function BYOBAddToCart({
  addToCartUnlocked,
  bundle,
  total,
}: BYOBAddToCartProps) {
  const {error, linesAdd, id: cartId, status} = useCart();
  const {openCart} = useMenu();
  const {isPreviewModeEnabled} = useRootLoaderData();

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

  const handleAddToCart = useCallback(async () => {
    if (!addToCartUnlocked || isAdding) return;
    // Don't drop the click while the cart is being created or updated: server
    // cart mutations are serialized (see `useCart`), so this add runs as soon as
    // the in-flight one settles. The editor preview's client-side cart has no
    // such queue and ignores adds while busy, so it keeps the guard.
    if (isPreviewModeEnabled && cartIsUpdating) return;
    setIsAdding(true);

    const items = Object.values(linesToAddByVariantId);

    const data = await linesAdd(items);
    // The editor preview's client-side cart resolves nothing; the effect below
    // settles that case from the cart status instead.
    if (isPreviewModeEnabled) return;
    setIsAdding(false);
    if (!data || data.userErrors?.length) return;
    setIsAdded(true);
    openCart();
    setTimeout(() => setIsAdded(false), 1000);
  }, [
    bundle,
    addToCartUnlocked,
    cartIsUpdating,
    isAdding,
    isPreviewModeEnabled,
    linesAdd,
    linesToAddByVariantId,
    status,
  ]);

  useEffect(() => {
    if (!isPreviewModeEnabled) return;
    if (isAdding && status === 'idle') {
      setIsAdding(false);
      setIsAdded(true);
      openCart();
      setTimeout(() => setIsAdded(false), 1000);
    }
  }, [cartId, status, linesToAddByVariantId, isAdding, isPreviewModeEnabled]);

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
