import {memo} from 'react';

import {ProductOptionValueButton} from './ProductOptionValueButton';
import {ProductOptionValueLink} from './ProductOptionValueLink';
import {useProductOptionValue} from './useProductOptionValue';
import type {ProductOptionValueProps} from './ProductOptionValue.types';

export const ProductOptionValue = memo(
  ({
    index,
    isModalProduct,
    name,
    onSelect,
    optimisticSelectedIndex,
    optionValue,
    product,
    selectedOptionsMap,
    setOptimisticSelectedIndex,
    setSelectedOption,
    swatchesMap,
  }: ProductOptionValueProps) => {
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
        index={index}
        isAvailable={isAvailable}
        isColor={isColor}
        isDisabled={isDisabled}
        isModalProduct={isModalProduct}
        isSelected={isSelected}
        onSelect={onSelect}
        optimisticSelectedIndex={optimisticSelectedIndex}
        selectedVariantFromOptions={selectedVariantFromOptions}
        setOptimisticSelectedIndex={setOptimisticSelectedIndex}
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
  },
);

ProductOptionValue.displayName = 'ProductOptionValue';
