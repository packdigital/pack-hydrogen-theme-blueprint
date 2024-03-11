import {useProduct} from '@shopify/hydrogen-react';

import type {ProductWithGrouping, SelectedVariant} from '~/lib/types';

import {ProductOptionValues} from './ProductOptionValues';

interface ProductOptionsProps {
  product: ProductWithGrouping;
  selectedVariant: SelectedVariant;
}

export function ProductOptions({product}: ProductOptionsProps) {
  const _product = useProduct();
  const {setSelectedOption} = _product;
  const selectedOptionsMap = _product.selectedOptions as Record<string, string>;

  return (
    <div className="flex flex-col">
      {product.options?.map((option, index) => {
        return (
          <div
            key={index}
            className="border-b border-b-border py-4 first:border-t first:border-t-border"
          >
            <ProductOptionValues
              option={option}
              product={product}
              selectedOptionsMap={selectedOptionsMap}
              setSelectedOption={setSelectedOption}
            />
          </div>
        );
      })}
    </div>
  );
}

ProductOptions.displayName = 'ProductOptions';
