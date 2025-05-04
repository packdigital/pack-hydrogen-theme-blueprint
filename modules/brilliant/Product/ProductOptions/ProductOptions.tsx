import {useAnalytics} from '@shopify/hydrogen';
import {ProductOptionValues} from 'modules/brilliant/Product/ProductOptions/ProductOptionValues';
import {useCallback} from 'react';

import type {OnSelect, ProductOptionsProps} from './ProductOptions.types';

import {AnalyticsEvent} from '~/components/Analytics/constants';

export function ProductOptions({
  isModalProduct,
  isShoppableProductCard,
  product,
  selectedOptionsMap,
  setSelectedOption,
  swatchesMap,
  optionsImageVariantMap,
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
    [isShoppableProductCard, publish, product.handle, shop],
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
              optionsImageVariantMap={optionsImageVariantMap}
            />
          </div>
        );
      })}
    </div>
  );
}

ProductOptions.displayName = 'ProductOptions';
