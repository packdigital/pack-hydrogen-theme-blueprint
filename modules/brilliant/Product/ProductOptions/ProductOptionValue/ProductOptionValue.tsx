import {memo, useMemo} from 'react';

import type {ProductOptionValueProps} from './ProductOptionValue.types';
import {ProductOptionValueButton} from './ProductOptionValueButton';
import {ProductOptionValueVariantImage} from './ProductOptionValueVariantImage';

import {ProductOptionValueLink} from '~/components/Product/ProductOptions/ProductOptionValue/ProductOptionValueLink';
import {useProductOptionValue} from '~/components/Product/ProductOptions/ProductOptionValue/useProductOptionValue';

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
    optionsImageVariantMap,
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

    const hasOptionImageVariantMap = useMemo(
      () =>
        optionsImageVariantMap
          ? Object.keys(optionsImageVariantMap).length > 0
          : false,
      [optionsImageVariantMap],
    );

    return (
      <>
        {isFromGrouping && (
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
            setOptimisticSelectedSubgroupIndex={
              setOptimisticSelectedSubgroupIndex
            }
            subgroupIndex={subgroupIndex}
            swatch={swatch}
          />
        )}

        {hasOptionImageVariantMap && onSelect && (
          <ProductOptionValueVariantImage
            optionsImageVariantMap={optionsImageVariantMap}
            optionValue={optionValue}
            selectedVariantFromOptions={selectedVariantFromOptions}
            isSelected={isSelected}
            onSelect={onSelect}
            optionName={name}
            setSelectedOption={setSelectedOption}
          />
        )}

        {!hasOptionImageVariantMap && (
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
        )}
      </>
    );
  },
);

ProductOptionValue.displayName = 'ProductOptionValue';
