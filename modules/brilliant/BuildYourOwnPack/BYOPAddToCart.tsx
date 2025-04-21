import {useLocation, useNavigate} from '@remix-run/react';
import {useCart} from '@shopify/hydrogen-react';
import {useCallback, useEffect, useMemo, useState} from 'react';

import type {BYOPAddToCartProps} from './BuildYourOwnPack.types';

import {LoadingDots} from '~/components/Animations/LoadingDots';
import {useMenu} from '~/hooks';

export function BYOPAddToCart({
  addToCartUnlocked,
  bundle,
  total,
  clid,
  selectedVariant,
}: BYOPAddToCartProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const {error, linesAdd, linesUpdate, id: cartId, status} = useCart();
  const {openCart} = useMenu();

  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const cartIsUpdating = status === 'creating' || status === 'updating';

  const safeBundle = useMemo(
    () => (Array.isArray(bundle) ? bundle : []),
    [bundle],
  );

  const linesToAddByVariantId = useMemo(() => {
    return safeBundle.reduce(
      (
        acc: Record<
          string,
          {
            merchandiseId: string;
            quantity: number;
            title: string;
            productId: string;
          }
        >,
        variant,
      ) => {
        if (!variant || !variant.id || !variant.product) return acc;

        if (acc[variant.id]) {
          return {
            ...acc,
            [variant.id]: {
              ...acc[variant.id],
              quantity: acc[variant.id].quantity + 1,
              title: variant.product.title || '',
              productId: variant.product.id || '',
            },
          };
        }
        return {
          ...acc,
          [variant.id]: {
            merchandiseId: variant.id,
            quantity: 1,
            title: variant.product.title || '',
            productId: variant.product.id || '',
          },
        };
      },
      {},
    );
  }, [safeBundle]);

  const handleAddToCart = useCallback(() => {
    if (
      !addToCartUnlocked ||
      isAdding ||
      cartIsUpdating ||
      !selectedVariant?.id
    )
      return;
    setIsAdding(true);

    const bundleItems = Object.values(linesToAddByVariantId).flatMap(
      (item, index) => [
        {
          key: `_item_${index}_title`,
          value: `${item.title} ${
            item.quantity > 1 ? '(' + String(item.quantity) + 'x)' : ''
          }`,
        },
        {
          key: `_item_${index}_id`,
          value: item.merchandiseId,
        },
        {
          key: `_item_${index}_productId`,
          value: item.productId,
        },
        {
          key: `_item_${index}_qty`,
          value: String(item.quantity),
        },
        {
          key: `product ${index}`,
          value: `${item.title} ${
            item.quantity > 1 ? '(' + String(item.quantity) + 'x)' : ''
          }`,
        },
      ],
    );

    //based on currently selected tierOption, choose variant id
    const itemCartPayload = {
      merchandiseId: selectedVariant?.id || '',
      quantity: 1,
      attributes: bundleItems,
    };

    if (clid) {
      //update item payload and call
      linesUpdate([
        {
          id: clid,
          ...itemCartPayload,
        },
      ]);
    } else {
      //add item payload and call
      linesAdd([
        {
          ...itemCartPayload,
        },
      ]);
    }
  }, [
    addToCartUnlocked,
    isAdding,
    cartIsUpdating,
    linesToAddByVariantId,
    selectedVariant?.id,
    clid,
    linesUpdate,
    linesAdd,
  ]);

  useEffect(() => {
    if (isAdding && status === 'idle') {
      setIsAdding(false);
      setIsAdded(true);
      openCart();
      navigate(location.pathname);
      setTimeout(() => setIsAdded(false), 1000);
    }
  }, [
    cartId,
    status,
    linesToAddByVariantId,
    isAdding,
    openCart,
    navigate,
    location.pathname,
  ]);

  useEffect(() => {
    if (!error) return;
    console.error('@shopify/hydrogen-react:useCart', error);
  }, [error]);

  const formattedPrice = useMemo(() => {
    if (!selectedVariant) return '$0.00';
    if (!selectedVariant.price?.amount) return '$0.00';
    const price = parseFloat(selectedVariant.price.amount);

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: selectedVariant.price.currencyCode || 'USD',
      minimumFractionDigits: price % 1 === 0 ? 0 : 2, // Hide cents if whole number
    }).format(price);
  }, [selectedVariant]);

  return (
    <button
      aria-label="Add bundle to cart"
      disabled={!addToCartUnlocked}
      className="btn-primary w-full"
      onClick={handleAddToCart}
      type="button"
    >
      <span className={`${isAdding || isAdded ? 'invisible' : 'visible'}`}>
        {clid ? 'Update Item In Your Cart' : `Add To Cart ${formattedPrice} `}
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

BYOPAddToCart.displayName = 'BYOPAddToCart';
