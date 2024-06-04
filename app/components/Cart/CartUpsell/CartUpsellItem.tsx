import {BackInStockModal, Image, Link, Spinner} from '~/components';
import {PRODUCT_IMAGE_ASPECT_RATIO} from '~/lib/constants';
import {useAddToCart, useVariantPrices} from '~/hooks';

import type {CartUpsellItemProps} from '../Cart.types';

export function CartUpsellItem({
  closeCart,
  isOnlyUpsell,
  product,
}: CartUpsellItemProps) {
  const selectedVariant = product.variants?.nodes?.[0];

  const {
    buttonText,
    cartIsUpdating,
    isAdding,
    isNotifyMe,
    isSoldOut,
    handleAddToCart,
    handleNotifyMe,
  } = useAddToCart({
    selectedVariant,
  });

  const {price, compareAtPrice} = useVariantPrices(selectedVariant);

  const image = product.featuredImage;
  const isUpdatingClass = isAdding || cartIsUpdating ? 'cursor-default' : '';
  const url = `/products/${product.handle}`;

  return (
    <div
      className={`flex items-center justify-center gap-4 ${
        isOnlyUpsell ? 'px-4' : 'px-10'
      }`}
    >
      <Link
        aria-label={product.title}
        to={url}
        onClick={closeCart}
        tabIndex={-1}
      >
        <Image
          data={{
            ...image,
            altText: product.title,
          }}
          aspectRatio={
            image?.width && image?.height
              ? `${image.width}/${image.height}`
              : PRODUCT_IMAGE_ASPECT_RATIO
          }
          width="40"
          isStatic
        />
      </Link>

      <div className="flex max-w-[25rem] flex-1 flex-col gap-2">
        <Link
          aria-label={product.title}
          className="self-start"
          to={url}
          onClick={closeCart}
        >
          <h4 className="text-xs font-bold">{product.title}</h4>
        </Link>

        <div className="flex items-center justify-between gap-4">
          <button
            aria-label={buttonText}
            className={`text-label-sm text-main-underline ${isUpdatingClass}`}
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
            {isAdding ? (
              <div className="flex h-4 items-center justify-center px-6">
                <Spinner width="12" color="gray" />
              </div>
            ) : (
              buttonText
            )}
          </button>

          <div className="flex flex-1 flex-wrap justify-end gap-x-1">
            {compareAtPrice && (
              <p className="text-xs text-mediumDarkGray line-through">
                {compareAtPrice}
              </p>
            )}
            <p className="text-xs">{price}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

CartUpsellItem.displayName = 'CartUpsellItem';
