import type {ProductItemPriceProps} from '~/components/ProductItem/ProductItem.types';
import {useVariantPrices} from '~/hooks';

export function ProductItemPrice({selectedVariant}: ProductItemPriceProps) {
  const {price, compareAtPrice} = useVariantPrices(selectedVariant);

  return (
    <div className="mt-1 flex flex-1 flex-wrap gap-x-1">
      {compareAtPrice && (
        <p className="text-neutralMedium line-through">{compareAtPrice}</p>
      )}
      <p className="min-h-5">{price}</p>
    </div>
  );
}

ProductItemPrice.displayName = 'ProductItemPrice';
