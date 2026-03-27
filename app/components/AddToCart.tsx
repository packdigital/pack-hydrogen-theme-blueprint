import {useEffect} from 'react';
import clsx from 'clsx';
import type {
  AttributeInput,
  SellingPlan,
} from '@shopify/hydrogen/storefront-api-types';

import {BackInStockModal} from '~/components/BackInStockModal';
import {LoadingDots} from '~/components/Animations';
import {useAddToCart} from '~/hooks';
import type {SelectedVariant} from '~/lib/types';

interface AddToCartProps {
  addToCartText?: string;
  attributes?: AttributeInput[];
  className?: string;
  containerClassName?: string;
  enabledInlinePrice?: boolean;
  isPdp?: boolean;
  quantity?: number;
  onAddToCart?: () => void;
  price?: string;
  selectedVariant: SelectedVariant;
  sellingPlanId?: SellingPlan['id'];
}

export function AddToCart({
  addToCartText = '',
  attributes,
  className = '',
  containerClassName = '',
  enabledInlinePrice,
  isPdp = false,
  quantity = 1,
  onAddToCart,
  price,
  selectedVariant,
  sellingPlanId,
}: AddToCartProps) {
  const {
    buttonText,
    cartIsUpdating,
    failed,
    isAdded,
    isAdding,
    isNotifyMe,
    isPreorder,
    isSoldOut,
    preOrderShippingText,
    subtext,
    handleAddToCart,
    handleNotifyMe,
  } = useAddToCart({
    addToCartText,
    attributes,
    quantity,
    selectedVariant,
    sellingPlanId,
  });

  useEffect(() => {
    if (isAdded && onAddToCart) {
      onAddToCart();
    }
  }, [isAdded, onAddToCart]);

  const isUpdatingClass = isAdding || cartIsUpdating ? 'cursor-default' : '';
  const buttonClass = isPreorder
    ? 'btn-inverse-dark'
    : isNotifyMe
      ? 'btn-inverse-dark'
      : 'btn-primary';

  return (
    <div className={clsx(containerClassName)}>
      {isPdp && isPreorder && preOrderShippingText && (
        <p className="mb-3 text-sm">
          Estimated ship date: {preOrderShippingText}
        </p>
      )}
      <button
        aria-label={buttonText}
        className={clsx(
          buttonClass,
          'relative w-full',
          isUpdatingClass,
          className,
          failed && 'bg-red-500',
        )}
        disabled={!!isSoldOut && !isNotifyMe}
        onClick={() => {
          if (isNotifyMe) {
            handleNotifyMe(
              <BackInStockModal selectedVariant={selectedVariant} />,
            );
          } else {
            handleAddToCart();
          }
        }}
        type="button"
      >
        <span className={clsx(isAdding || isAdded ? 'invisible' : 'visible')}>
          {buttonText}
          {!isSoldOut && (
            <span className="font-normal">
              {enabledInlinePrice && price ? ` - ${price}` : ''}
            </span>
          )}
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

      {isPdp && subtext && (
        <p className="mt-1 text-center text-xs">{subtext}</p>
      )}
    </div>
  );
}

AddToCart.displayName = 'AddToCart';
