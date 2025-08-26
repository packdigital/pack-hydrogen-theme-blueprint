import {useMemo} from 'react';
import {Money} from '@shopify/hydrogen-react';

import {Image} from '~/components/Image';
import {Link} from '~/components/Link';
import {PRODUCT_IMAGE_ASPECT_RATIO} from '~/lib/constants';
import {useProductById} from '~/hooks';

import type {OrderItemProps} from './Order.types';

export function OrderItem({item}: OrderItemProps) {
  const {totalDiscount, price, quantity, productId, image, variantTitle} = item;

  const fullProduct = useProductById(productId);

  const {originalPrice, discountedPrice} = useMemo(() => {
    const discountNum = Number(totalDiscount?.amount || 0);
    const priceNum = Number(price?.amount || 0);
    const originalPriceNum = priceNum + discountNum;
    return {
      originalPrice: {
        amount: (originalPriceNum / quantity).toFixed(2),
        currencyCode: price?.currencyCode,
      },
      discountedPrice: discountNum
        ? {
            amount: (priceNum / quantity).toFixed(2),
            currencyCode: price?.currencyCode,
          }
        : null,
    };
  }, [quantity, price, totalDiscount]);

  return (
    <div className="grid grid-cols-[10fr_auto] items-center gap-3 border-b border-b-border py-4 text-sm md:grid-cols-[6fr_2fr_1fr_1fr_1fr]">
      <div className="grid grid-cols-[3rem_1fr] items-center gap-4">
        {/* mobile/desktop product image */}
        <Image
          data={{
            ...image,
            altText: fullProduct?.title,
          }}
          aspectRatio={
            image?.width && image?.height
              ? `${image.width}/${image.height}`
              : PRODUCT_IMAGE_ASPECT_RATIO
          }
          width="48px"
        />

        <div className="flex flex-1 flex-col items-start gap-2">
          {/* mobile/desktop product title */}
          {fullProduct ? (
            <Link
              aria-label={fullProduct.title}
              to={`/products/${fullProduct?.handle}`}
            >
              <p className="whitespace-normal break-words font-semibold">
                {fullProduct.title}
              </p>
            </Link>
          ) : (
            <p className="whitespace-normal break-words font-semibold">
              {item.title}
            </p>
          )}

          {/* mobile variant title */}
          {variantTitle !== 'Default Title' && (
            <p className="text-2xs md:hidden">{variantTitle}</p>
          )}

          {/* mobile price per qty and quantity */}
          <div className="flex gap-1 text-xs md:hidden">
            {discountedPrice && (
              <Money
                as="p"
                className="text-neutralMedium line-through"
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
        {variantTitle !== 'Default Title' ? variantTitle : ''}
      </p>

      {/* desktop price per qty */}
      <div className="hidden md:block">
        {discountedPrice && (
          <Money
            as="p"
            className="text-neutralMedium line-through"
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
            className="text-neutralMedium line-through"
            data={discountedPrice}
          />
        )}
        <Money as="p" data={originalPrice} />
      </div>
    </div>
  );
}

OrderItem.displayName = 'OrderItem';
