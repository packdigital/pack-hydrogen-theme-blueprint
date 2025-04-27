import type {
  AttributeInput,
  SellingPlan,
} from '@shopify/hydrogen/storefront-api-types';
import {
  CheckCheckIcon,
  CircleArrowDown,
  ShoppingBag,
  ShoppingCartIcon,
} from 'lucide-react';
import {useEffect} from 'react';

import {LoadingDots} from '~/components/Animations';
import {BackInStockModal} from '~/components/BackInStockModal';
import {Button} from '~/components/ui/button';
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
  size: 'sm' | 'lg' | 'default';
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
  size,
}: AddToCartProps) {
  const {
    buttonText,
    cartIsUpdating,
    isAdded,
    isAdding,
    isNotifyMe,
    isSoldOut,
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
  const isNotifyMeClass = isNotifyMe
    ? 'btn-inverse-dark'
    : 'primary py-2 px-4 h-10';

  return (
    <div className={`${containerClassName}`}>
      <Button
        aria-label={buttonText}
        className={`${isNotifyMeClass} relative w-full grow ${isUpdatingClass} ${className}`}
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
        size={size ?? 'default'}
      >
        <span className={`${isAdding || isAdded ? 'hidden' : 'visible'}`}>
          {size === 'sm' && <ShoppingCartIcon />}
          {size === 'default' && buttonText}
          {!isSoldOut && (
            <span className="font-normal">
              {enabledInlinePrice && price ? ` - ${price}` : ''}
            </span>
          )}
        </span>

        {isAdding && (
          <div className="mx-0 flex flex-row justify-between gap-2">
            <span className="px-3">
              <LoadingDots
                status="Adding to cart"
                withAbsolutePosition
                withStatusRole
              />
            </span>
          </div>
        )}

        {isAdded && (
          <div className="mx-0 flex flex-row justify-between gap-2">
            <CheckCheckIcon />
            <span aria-live="assertive" className="sr-only" role="status">
              Added To Cart
            </span>
          </div>
        )}
      </Button>

      {isPdp && subtext && (
        <p className="mt-1 text-center text-xs">{subtext}</p>
      )}
    </div>
  );
}

AddToCart.displayName = 'AddToCart';
