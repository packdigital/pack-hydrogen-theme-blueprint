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
    optimisticSelectedSubgroupIndex,
    optionValue,
    product,
    selectedOptionsMap,
    setOptimisticSelectedIndex,
    setOptimisticSelectedSubgroupIndex,
    setSelectedOption,
    subgroupIndex,
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
        optimisticSelectedSubgroupIndex={optimisticSelectedSubgroupIndex}
        optionName={name}
        optionValue={optionValue}
        selectedVariantFromOptions={selectedVariantFromOptions}
        setOptimisticSelectedIndex={setOptimisticSelectedIndex}
        setOptimisticSelectedSubgroupIndex={setOptimisticSelectedSubgroupIndex}
        subgroupIndex={subgroupIndex}
        swatch={swatch}
      />
    ) : (
      <ProductOptionValueButton
        isAvailable={isAvailable}
        isColor={isColor}
        isDisabled={isDisabled}
        isSelected={isSelected}
        onSelect={onSelect}
        optionName={name}
        optionValue={optionValue}
        selectedVariantFromOptions={selectedVariantFromOptions}
        setSelectedOption={setSelectedOption}
        swatch={swatch}
      />
    );
  },
);

ProductOptionValue.displayName = 'ProductOptionValue';
