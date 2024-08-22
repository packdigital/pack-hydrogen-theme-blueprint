import {useCallback} from 'react';
import {useAnalytics} from '@shopify/hydrogen';
import {useProduct} from '@shopify/hydrogen-react';
import type {ProductOptionValue} from '@shopify/hydrogen/storefront-api-types';

import {PackEventName} from '~/components/PackAnalytics/constants';
import {useColorSwatches} from '~/hooks';
import type {ProductWithGrouping, SelectedVariant} from '~/lib/types';

import {ProductOptionValues} from './ProductOptionValues';

export type OnSelect = ({
  selectedVariant,
  optionName,
  optionValue,
  fromGrouping,
  fromProductHandle,
}: {
  selectedVariant: SelectedVariant;
  optionName: string;
  optionValue: Pick<ProductOptionValue, 'name'>;
  fromGrouping?: boolean;
  fromProductHandle?: string;
}) => void;

export interface ProductOptionsProps {
  product: ProductWithGrouping;
  selectedVariant: SelectedVariant;
}

export function ProductOptions({product}: ProductOptionsProps) {
  const swatchesMap = useColorSwatches();
  const _product = useProduct();
  const {publish, shop} = useAnalytics();

  const handleSelect: OnSelect = useCallback(
    ({selectedVariant, optionName, optionValue, fromGrouping}) => {
      publish(PackEventName.PRODUCT_VARIANT_SELECTED, {
        selectedVariant,
        optionName,
        optionValue,
        fromGrouping,
        fromProductHandle: product.handle,
        shop,
      });
    },
    [publish, product.handle],
  );

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
              onSelect={handleSelect}
              option={option}
              product={product}
              selectedOptionsMap={selectedOptionsMap}
              setSelectedOption={setSelectedOption}
              swatchesMap={swatchesMap}
            />
          </div>
        );
      })}
    </div>
  );
}

ProductOptions.displayName = 'ProductOptions';
