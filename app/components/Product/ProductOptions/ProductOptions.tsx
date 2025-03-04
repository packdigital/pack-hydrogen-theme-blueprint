import {useCallback} from 'react';
import {useAnalytics} from '@shopify/hydrogen';

import {AnalyticsEvent} from '~/components/Analytics/constants';

import {ProductOptionValues} from './ProductOptionValues';
import type {OnSelect, ProductOptionsProps} from './ProductOptions.types';

export function ProductOptions({
  isModalProduct,
  isShoppableProductCard,
  product,
  selectedOptionsMap,
  setSelectedOption,
  swatchesMap,
}: ProductOptionsProps) {
  const {publish, shop} = useAnalytics();

  const handleSelect: OnSelect = useCallback(
    ({selectedVariant, optionName, optionValue, fromGrouping = false}) => {
      if (isShoppableProductCard) return;
      publish(AnalyticsEvent.PRODUCT_VARIANT_SELECTED, {
        selectedVariant,
        optionName,
        optionValue,
        fromGrouping,
        fromProductHandle: product.handle,
        shop,
      });
    },
    [isShoppableProductCard, publish, product.handle],
  );

  return (
    <div className="flex flex-col">
      {product.options?.map((option, index) => {
        return (
          <div
            key={index}
            className="border-b border-b-border py-4 first:border-t first:border-t-border"
          >
            <ProductOptionValues
              isModalProduct={isModalProduct}
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
