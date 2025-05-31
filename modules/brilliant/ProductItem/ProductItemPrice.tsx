import {useMoney} from '@shopify/hydrogen-react';

import type {ProductItemPriceProps} from '~/components/ProductItem/ProductItem.types';
import {useVariantPrices} from '~/hooks';

export function ProductItemPrice({selectedVariant}: ProductItemPriceProps) {
  const {compareAtPrice} = useVariantPrices(selectedVariant);

  const bundlePrice = useMoney({
    amount: selectedVariant?.price.amount || '0.00',
    currencyCode: selectedVariant?.price.currencyCode || 'USD',
  });

  return (
    <div className="mt-1 flex flex-1 flex-wrap gap-x-1">
      {compareAtPrice && (
        <p className="text-neutralMedium line-through">{compareAtPrice}</p>
      )}
      <p className="min-h-5">{bundlePrice.localizedString}</p>
    </div>
  );
}

ProductItemPrice.displayName = 'ProductItemPrice';
