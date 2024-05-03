import type {SelectedVariant} from '~/lib/types';
import {useVariantPrices} from '~/hooks';

interface ProductItemPriceProps {
  selectedVariant: SelectedVariant;
}

export function ProductItemPrice({selectedVariant}: ProductItemPriceProps) {
  const {price, compareAtPrice} = useVariantPrices(selectedVariant);

  return (
    <div className="mt-1 flex flex-1 flex-wrap gap-x-1">
      {compareAtPrice && (
        <p className="text-sm text-mediumDarkGray line-through">
          {compareAtPrice}
        </p>
      )}
      <p className="min-h-5 text-sm">{price}</p>
    </div>
  );
}

ProductItemPrice.displayName = 'ProductItemPrice';
