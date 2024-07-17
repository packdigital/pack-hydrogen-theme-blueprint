import type {ProductOptionValue as ProductOptionValueType} from '@shopify/hydrogen/storefront-api-types';

import type {ProductWithGrouping, SwatchesMap} from '~/lib/types';

import {ProductOptionValueButton} from './ProductOptionValueButton';
import {ProductOptionValueLink} from './ProductOptionValueLink';
import {useProductOptionValue} from './useProductOptionValue';

interface ProductOptionValueProps {
  name: string;
  optionValue: ProductOptionValueType;
  product: ProductWithGrouping;
  selectedOptionsMap: Record<string, string>;
  setSelectedOption: (name: string, value: string) => void;
  swatchesMap: SwatchesMap;
}

export function ProductOptionValue({
  name,
  optionValue,
  product,
  selectedOptionsMap,
  setSelectedOption,
  swatchesMap,
}: ProductOptionValueProps) {
  const {
    isAvailable,
    isColor,
    isDisabled,
    isFromGrouping,
    isSelected,
    selectedVariantFromOptions,
  } = useProductOptionValue({
    name,
    product,
    selectedOptionsMap,
    optionValue,
  });

  const swatch = swatchesMap?.[optionValue.name.toLowerCase()];

  return isFromGrouping ? (
    <ProductOptionValueLink
      isAvailable={isAvailable}
      isColor={isColor}
      isDisabled={isDisabled}
      isSelected={isSelected}
      selectedVariantFromOptions={selectedVariantFromOptions}
      swatch={swatch}
      optionValue={optionValue}
    />
  ) : (
    <ProductOptionValueButton
      isAvailable={isAvailable}
      isColor={isColor}
      isDisabled={isDisabled}
      isSelected={isSelected}
      name={name}
      setSelectedOption={setSelectedOption}
      swatch={swatch}
      optionValue={optionValue}
    />
  );
}

ProductOptionValue.displayName = 'ProductOptionValue';
