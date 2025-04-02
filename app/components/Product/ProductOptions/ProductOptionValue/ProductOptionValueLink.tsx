import {useMemo} from 'react';
import {useLocation} from '@remix-run/react';

import {Link} from '~/components/Link';
import {useProductModal} from '~/hooks';

import {InnerColorOptionValue} from './InnerColorOptionValue';
import {InnerOptionValue} from './InnerOptionValue';
import type {
  ProductOptionValueLinkProps,
  ProductOptionValueLinkComponentProps,
  ProductOptionValueLinkIntermediaryProps,
} from './ProductOptionValue.types';

export function ProductOptionValueLink({
  index,
  isAvailable,
  isColor,
  isDisabled,
  isModalProduct,
  isSelected,
  onSelect,
  optimisticSelectedIndex,
  optimisticSelectedSubgroupIndex = 0,
  optionName,
  optionValue,
  selectedVariantFromOptions,
  setOptimisticSelectedIndex,
  setOptimisticSelectedSubgroupIndex,
  subgroupIndex,
  swatch,
}: ProductOptionValueLinkProps) {
  const isOptimisticSelected = setOptimisticSelectedSubgroupIndex
    ? subgroupIndex === optimisticSelectedSubgroupIndex &&
      index === optimisticSelectedIndex
    : index === optimisticSelectedIndex;
  const isVisiblySelected =
    isOptimisticSelected || (isSelected && optimisticSelectedIndex === -1);

  return isModalProduct ? (
    <ProductOptionValueModalLink
      index={index}
      isAvailable={isAvailable}
      isColor={isColor}
      isDisabled={isDisabled}
      isSelected={isSelected}
      isVisiblySelected={isVisiblySelected}
      optionName={optionName}
      optionValue={optionValue}
      selectedVariantFromOptions={selectedVariantFromOptions}
      setOptimisticSelectedIndex={setOptimisticSelectedIndex}
      setOptimisticSelectedSubgroupIndex={setOptimisticSelectedSubgroupIndex}
      subgroupIndex={subgroupIndex}
      swatch={swatch}
    />
  ) : (
    <ProductOptionValuePdpLink
      index={index}
      isAvailable={isAvailable}
      isColor={isColor}
      isDisabled={isDisabled}
      isSelected={isSelected}
      isVisiblySelected={isVisiblySelected}
      onSelect={onSelect}
      optionName={optionName}
      optionValue={optionValue}
      selectedVariantFromOptions={selectedVariantFromOptions}
      setOptimisticSelectedIndex={setOptimisticSelectedIndex}
      setOptimisticSelectedSubgroupIndex={setOptimisticSelectedSubgroupIndex}
      subgroupIndex={subgroupIndex}
      swatch={swatch}
    />
  );
}

function ProductOptionValuePdpLink({
  index,
  isAvailable,
  isColor,
  isDisabled,
  isSelected,
  isVisiblySelected,
  onSelect,
  optionName,
  optionValue,
  selectedVariantFromOptions,
  setOptimisticSelectedIndex,
  setOptimisticSelectedSubgroupIndex,
  subgroupIndex,
  swatch,
}: ProductOptionValueLinkIntermediaryProps) {
  const {search} = useLocation();

  const url = useMemo(() => {
    if (!selectedVariantFromOptions) return null;
    const params = new URLSearchParams(search);
    selectedVariantFromOptions.selectedOptions.forEach(
      ({name: optionName, value}) => {
        params.set(optionName, value);
      },
    );
    return `/products/${selectedVariantFromOptions.product.handle}?${params}`;
  }, [search, selectedVariantFromOptions]);

  return (
    <ProductOptionValueLinkComponent
      index={index}
      isAvailable={isAvailable}
      isColor={isColor}
      isDisabled={isDisabled}
      isSelected={isSelected}
      isVisiblySelected={isVisiblySelected}
      onSelect={onSelect}
      optionName={optionName}
      optionValue={optionValue}
      selectedVariantFromOptions={selectedVariantFromOptions}
      setOptimisticSelectedIndex={setOptimisticSelectedIndex}
      setOptimisticSelectedSubgroupIndex={setOptimisticSelectedSubgroupIndex}
      subgroupIndex={subgroupIndex}
      swatch={swatch}
      url={url}
    />
  );
}

function ProductOptionValueModalLink({
  index,
  isAvailable,
  isColor,
  isDisabled,
  isSelected,
  isVisiblySelected,
  optionName,
  optionValue,
  selectedVariantFromOptions,
  setOptimisticSelectedIndex,
  setOptimisticSelectedSubgroupIndex,
  subgroupIndex,
  swatch,
}: ProductOptionValueLinkIntermediaryProps) {
  const {openProductUrl} = useProductModal({
    selectedVariant: selectedVariantFromOptions,
  });

  return (
    <ProductOptionValueLinkComponent
      index={index}
      isAvailable={isAvailable}
      isColor={isColor}
      isDisabled={isDisabled}
      isSelected={isSelected}
      isVisiblySelected={isVisiblySelected}
      optionName={optionName}
      optionValue={optionValue}
      selectedVariantFromOptions={selectedVariantFromOptions}
      setOptimisticSelectedIndex={setOptimisticSelectedIndex}
      setOptimisticSelectedSubgroupIndex={setOptimisticSelectedSubgroupIndex}
      subgroupIndex={subgroupIndex}
      swatch={swatch}
      url={openProductUrl}
    />
  );
}

function ProductOptionValueLinkComponent({
  index,
  isAvailable,
  isColor,
  isDisabled,
  isSelected,
  isVisiblySelected,
  onSelect,
  optionName,
  optionValue,
  selectedVariantFromOptions,
  setOptimisticSelectedIndex,
  setOptimisticSelectedSubgroupIndex,
  subgroupIndex = 0,
  swatch,
  url,
}: ProductOptionValueLinkComponentProps) {
  return (
    <Link
      aria-label={optionValue.name}
      className="group"
      preventScrollReset
      to={url}
      onClick={(e) => {
        if (isSelected || isDisabled) {
          e.preventDefault();
          return;
        }
        setOptimisticSelectedIndex(index);
        if (typeof setOptimisticSelectedSubgroupIndex === 'function') {
          setOptimisticSelectedSubgroupIndex(subgroupIndex);
        }
        if (typeof onSelect === 'function') {
          onSelect({
            selectedVariant: selectedVariantFromOptions,
            optionName,
            optionValue,
            fromGrouping: true,
          });
        }
      }}
    >
      {isColor ? (
        <InnerColorOptionValue
          isAvailable={isAvailable}
          isDisabled={isDisabled}
          isSelected={isVisiblySelected}
          swatch={swatch}
          optionValue={optionValue}
        />
      ) : (
        <InnerOptionValue
          isAvailable={isAvailable}
          isDisabled={isDisabled}
          isSelected={isVisiblySelected}
          optionValue={optionValue}
        />
      )}
    </Link>
  );
}

ProductOptionValueLink.displayName = 'ProductOptionValueLink';
