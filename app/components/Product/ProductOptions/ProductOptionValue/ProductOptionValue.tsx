import type {ProductOptionValue as ProductOptionValueType} from '@shopify/hydrogen/storefront-api-types';

import type {ProductWithGrouping, SwatchesMap} from '~/lib/types';

import type {OnSelect} from '../ProductOptions';

import {ProductOptionValueButton} from './ProductOptionValueButton';
import {ProductOptionValueLink} from './ProductOptionValueLink';
import {useProductOptionValue} from './useProductOptionValue';

interface ProductOptionValueProps {
  name: string;
  onSelect?: OnSelect;
  optionValue: ProductOptionValueType;
  product: ProductWithGrouping;
  selectedOptionsMap: Record<string, string>;
  setSelectedOption: (name: string, value: string) => void;
  swatchesMap: SwatchesMap;
}

export function ProductOptionValue({
  name,
  onSelect,
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
      onSelect={onSelect}
      selectedVariantFromOptions={selectedVariantFromOptions}
      swatch={swatch}
      optionName={name}
      optionValue={optionValue}
    />
  ) : (
    <ProductOptionValueButton
      isAvailable={isAvailable}
      isColor={isColor}
      isDisabled={isDisabled}
      isSelected={isSelected}
      onSelect={onSelect}
      selectedVariantFromOptions={selectedVariantFromOptions}
      setSelectedOption={setSelectedOption}
      swatch={swatch}
      optionName={name}
      optionValue={optionValue}
    />
  );
}

ProductOptionValue.displayName = 'ProductOptionValue';
