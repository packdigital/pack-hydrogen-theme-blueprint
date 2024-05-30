import {useMemo} from 'react';
import {Money} from '@shopify/hydrogen-react';
import type {OrderLineItem} from '@shopify/hydrogen/storefront-api-types';

import {Image, Link} from '~/components';
import {PRODUCT_IMAGE_ASPECT_RATIO} from '~/lib/constants';

export function OrderItem({item}: {item: OrderLineItem}) {
  const {discountedTotalPrice, originalTotalPrice, quantity, variant} = item;
  const {image} = {...variant};

  const {originalPrice, discountedPrice} = useMemo(() => {
    const discountedNum = Number(discountedTotalPrice?.amount);
    const originalNum = Number(originalTotalPrice?.amount);
    const isDiscounted = discountedNum < originalNum;
    return {
      originalPrice: {
        amount: (originalNum / quantity).toFixed(2),
        currencyCode: originalTotalPrice?.currencyCode,
      },
      discountedPrice: isDiscounted
        ? {
            amount: (discountedNum / quantity).toFixed(2),
            currencyCode: discountedTotalPrice?.currencyCode,
          }
        : null,
    };
  }, [discountedTotalPrice, originalTotalPrice, quantity]);

  return (
    <div className="grid grid-cols-[10fr_auto] items-center gap-3 border-b border-b-border py-4 text-sm md:grid-cols-[6fr_2fr_1fr_1fr_1fr]">
      <div className="grid grid-cols-[3rem_1fr] items-center gap-4">
        {/* mobile/desktop product image */}
        <Image
          data={{
            ...image,
            altText: variant?.product?.title,
          }}
          aspectRatio={
            image?.width && image?.height
              ? `${image.width}/${image.height}`
              : PRODUCT_IMAGE_ASPECT_RATIO
          }
          width="48"
          isStatic
        />

        <div className="flex flex-1 flex-col items-start gap-2">
          {/* mobile/desktop product title */}
          {variant?.product ? (
            <Link
              aria-label={variant.product.title}
              to={`/products/${variant?.product?.handle}`}
            >
              <p className="whitespace-normal break-words font-semibold">
                {variant.product.title}
              </p>
            </Link>
          ) : (
            <p className="whitespace-normal break-words font-semibold">
              {item.title}
            </p>
          )}

          {/* mobile variant title */}
          {variant?.title !== 'Default Title' && (
            <p className="text-2xs md:hidden">{variant?.title}</p>
          )}

          {/* mobile price per qty and quantity */}
          <div className="flex gap-1 text-xs md:hidden">
            {discountedPrice && (
              <Money
                as="p"
                className="text-mediumDarkGray line-through"
                data={discountedPrice}
              />
            )}
            <Money as="p" data={originalPrice} />
            <p>x {quantity}</p>
          </div>
        </div>
      </div>

      {/* desktop variant title */}
      <p className="hidden md:block">
        {variant?.title !== 'Default Title' ? '' : variant?.title}
      </p>

      {/* desktop price per qty */}
      <div className="hidden md:block">
        {discountedPrice && (
          <Money
            as="p"
            className="text-mediumDarkGray line-through"
            data={discountedPrice}
          />
        )}
        <Money as="p" data={originalPrice} />
      </div>

      {/* desktop quantity */}
      <p className="hidden md:block">{quantity}</p>

      {/* mobile/desktop total price */}
      <div>
        {discountedPrice && (
          <Money
            as="p"
            className="text-mediumDarkGray line-through"
            data={discountedTotalPrice}
          />
        )}
        <Money as="p" data={originalTotalPrice} />
      </div>
    </div>
  );
}

OrderItem.displayName = 'OrderItem';
