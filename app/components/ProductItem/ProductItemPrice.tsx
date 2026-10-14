import {memo} from 'react';

import {useVariantPrices} from '~/hooks';

import type {ProductItemPriceProps} from './ProductItem.types';

export const ProductItemPrice = memo(
  ({selectedVariant}: ProductItemPriceProps) => {
    const {price, compareAtPrice} = useVariantPrices(selectedVariant);

    return (
      <div className="mt-1 flex flex-1 flex-wrap gap-x-1">
        {compareAtPrice && (
          <p className="text-sm text-neutralMedium">
            <span className="sr-only">Regular price </span>
            <s>{compareAtPrice}</s>
          </p>
        )}
        <p className="min-h-5 text-sm">
          {compareAtPrice && <span className="sr-only">Sale price </span>}
          {price}
        </p>
      </div>
    );
  },
);

ProductItemPrice.displayName = 'ProductItemPrice';
