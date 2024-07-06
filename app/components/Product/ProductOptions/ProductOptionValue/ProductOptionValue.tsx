import type {ProductWithGrouping, SwatchesMap} from '~/lib/types';

import {ProductOptionValueButton} from './ProductOptionValueButton';
import {ProductOptionValueLink} from './ProductOptionValueLink';
import {useProductOptionValue} from './useProductOptionValue';

interface ProductOptionValueProps {
  name: string;
  product: ProductWithGrouping;
  selectedOptionsMap: Record<string, string>;
  setSelectedOption: (name: string, value: string) => void;
  swatchesMap: SwatchesMap;
  value: string;
}

export function ProductOptionValue({
  name,
  product,
  selectedOptionsMap,
  setSelectedOption,
  swatchesMap,
  value,
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
    value,
  });

  const swatch = swatchesMap?.[value.toLowerCase()];

  return isFromGrouping ? (
    <ProductOptionValueLink
      isAvailable={isAvailable}
      isColor={isColor}
      isDisabled={isDisabled}
      isSelected={isSelected}
      selectedVariantFromOptions={selectedVariantFromOptions}
      swatch={swatch}
      value={value}
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
      value={value}
    />
  );
}

ProductOptionValue.displayName = 'ProductOptionValue';
