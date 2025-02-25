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
  isPdp?: boolean;
  quantity?: number;
  selectedVariant: SelectedVariant;
  sellingPlanId?: SellingPlan['id'];
}

export function AddToCart({
  addToCartText = '',
  attributes,
  className = '',
  isPdp = false,
  quantity = 1,
  selectedVariant,
  sellingPlanId,
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

  const isUpdatingClass = isAdding || cartIsUpdating ? 'cursor-default' : '';
  const isNotifyMeClass = isNotifyMe ? 'btn-inverse-dark' : 'btn-primary';

  return (
    <div>
      <button
        aria-label={buttonText}
        className={`${isNotifyMeClass} relative w-full ${isUpdatingClass} ${className}`}
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
        <span className={`${isAdding || isAdded ? 'invisible' : 'visible'}`}>
          {buttonText}
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
