import {useMemo} from 'react';

import {Image, Link, QuantitySelector, Svg} from '~/components';
import {PRODUCT_IMAGE_ASPECT_RATIO} from '~/lib/constants';

import type {CartLineProps} from '../Cart.types';

import {useCartLine} from './useCartLine';
import {useCartLineImage} from './useCartLineImage';
import {useCartLinePrices} from './useCartLinePrices';

export function CartLine({closeCart, line}: CartLineProps) {
  const {discountAllocations, quantity, merchandise} = line;

  const {handleDecrement, handleIncrement, handleRemove, isUpdatingLine} =
    useCartLine({line});

  const {price, compareAtPrice} = useCartLinePrices({line});

  const image = useCartLineImage({line});

  const url = useMemo(() => {
    return `/products/${merchandise.product.handle}?merchandise=${merchandise.id
      .split('/')
      .pop()}`;
  }, [merchandise.id]);

  return (
    <div className="relative grid grid-cols-[auto_1fr] items-center gap-3 p-4 ">
      <Link
        aria-label={`View ${merchandise.product.title}`}
        to={url}
        onClick={closeCart}
        tabIndex={-1}
      >
        <Image
          data={{
            ...image,
            altText: merchandise.product.title,
          }}
          aspectRatio={
            image?.width && image?.height
              ? `${image.width}/${image.height}`
              : PRODUCT_IMAGE_ASPECT_RATIO
          }
          width="88"
          isStatic
          className="bg-offWhite"
        />
      </Link>

      <div className="flex min-h-[6.25em] flex-col justify-between gap-4">
        <div className="relative pr-6">
          <Link
            aria-label={`View ${merchandise.product.title}`}
            to={url}
            onClick={closeCart}
          >
            <h3 className="text-h6">{merchandise.product.title}</h3>
          </Link>

          {merchandise.title !== 'Default Title' && (
            <p className="text-sm text-mediumDarkGray">{merchandise.title}</p>
          )}

          <button
            aria-label={`Remove ${merchandise.product.title} from cart`}
            className="absolute right-0 top-0 w-3"
            onClick={handleRemove}
            type="button"
          >
            <Svg
              src="/svgs/close.svg#close"
              title="Close"
              viewBox="0 0 24 24"
            />
          </button>
        </div>

        <div className="flex items-end justify-between gap-3">
          <QuantitySelector
            handleDecrement={handleDecrement}
            handleIncrement={handleIncrement}
            isUpdating={isUpdatingLine}
            productTitle={merchandise.product.title}
            quantity={quantity}
          />

          <div className="flex flex-1 flex-col items-end pb-1">
            {/* Applicable cart line discounts */}
            {discountAllocations?.length > 0 &&
              discountAllocations.map(
                (discount: {title?: string; code?: string}, index) => {
                  if (!discount.title && !discount.code) return null;
                  return (
                    <div key={index} className="flex items-start gap-1">
                      {discount.code && (
                        <Svg
                          className="w-3.5 pt-0.5"
                          src="/svgs/discount.svg#discount"
                          title="Close"
                          viewBox="0 0 24 24"
                        />
                      )}
                      <p className="flex-1 pb-1 text-xs text-mediumDarkGray">
                        {discount.title || discount.code}
                      </p>
                    </div>
                  );
                },
              )}

            <div className="flex flex-wrap justify-end gap-x-2">
              {compareAtPrice && (
                <p className="text-mediumDarkGray line-through">
                  {compareAtPrice}
                </p>
              )}
              <p>{price}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

CartLine.displayName = 'CartLine';
