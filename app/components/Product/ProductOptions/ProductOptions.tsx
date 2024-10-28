import {useCallback, useMemo} from 'react';
import {useAnalytics} from '@shopify/hydrogen';
import {useProduct} from '@shopify/hydrogen-react';

import {AnalyticsEvent} from '~/components/Analytics/constants';
import {useColorSwatches} from '~/hooks';

import {ProductOptionValues} from './ProductOptionValues';
import type {OnSelect, ProductOptionsProps} from './ProductOptions.types';

export function ProductOptions({
  product,
  selectedVariant,
}: ProductOptionsProps) {
  const swatchesMap = useColorSwatches();
  const {setSelectedOption} = useProduct();
  const {publish, shop} = useAnalytics();

  const handleSelect: OnSelect = useCallback(
    ({selectedVariant, optionName, optionValue, fromGrouping = false}) => {
      publish(AnalyticsEvent.PRODUCT_VARIANT_SELECTED, {
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

  const selectedOptionsMap = useMemo(() => {
    if (!selectedVariant) return null;
    return selectedVariant.selectedOptions.reduce(
      (acc: Record<string, string>, {name, value}) => ({...acc, [name]: value}),
      {},
    );
  }, [selectedVariant]);

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
