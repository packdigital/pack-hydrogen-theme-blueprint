import {BackInStockModal, LoadingDots} from '~/components';
import {useAddToCart} from '~/hooks';
import type {SelectedVariant} from '~/lib/types';

interface AddToCartProps {
  addToCartText?: string;
  className?: string;
  isPdp?: boolean;
  quantity?: number;
  selectedVariant: SelectedVariant;
}

export function AddToCart({
  addToCartText = '',
  className = '',
  isPdp = false,
  quantity = 1,
  selectedVariant,
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
    quantity,
    selectedVariant,
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
        {!isAdding && !isAdded && buttonText}

        {isAdding && (
          <span aria-label="Adding to cart" aria-live="assertive" role="status">
            <LoadingDots color="white" />
          </span>
        )}

        {isAdded && (
          <span aria-live="assertive" role="status">
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
