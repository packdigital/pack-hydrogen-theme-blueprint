import type {I18nLocale, ProductWithGrouping} from '~/lib/types';

import {ProductOptionValueButton} from './ProductOptionValueButton';
import {ProductOptionValueLink} from './ProductOptionValueLink';
import {useProductOptionValue} from './useProductOptionValue';

interface ProductOptionValueProps {
  name: string;
  pathPrefix: I18nLocale['pathPrefix'];
  product: ProductWithGrouping;
  selectedOptionsMap: Record<string, string>;
  setSelectedOption: (name: string, value: string) => void;
  value: string;
}

export function ProductOptionValue({
  name,
  pathPrefix,
  product,
  selectedOptionsMap,
  setSelectedOption,
  value,
}: ProductOptionValueProps) {
  const {
    isAvailable,
    isColor,
    isDisabled,
    isFromGrouping,
    isSelected,
    selectedVariantFromOptions,
    swatch,
  } = useProductOptionValue({
    name,
    product,
    selectedOptionsMap,
    value,
  });

  return isFromGrouping ? (
    <ProductOptionValueLink
      isAvailable={isAvailable}
      isColor={isColor}
      isDisabled={isDisabled}
      isSelected={isSelected}
      pathPrefix={pathPrefix}
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
