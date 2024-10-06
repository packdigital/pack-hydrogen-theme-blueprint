import {useMemo} from 'react';
import {useLocation} from '@remix-run/react';

import {Link} from '~/components';

import {InnerColorOptionValue} from './InnerColorOptionValue';
import {InnerOptionValue} from './InnerOptionValue';
import type {ProductOptionValueLinkProps} from './ProductOptionValue.types';

export function ProductOptionValueLink({
  index,
  isAvailable,
  isColor,
  isDisabled,
  isSelected,
  onSelect,
  optimisticSelectedIndex,
  optionName,
  optionValue,
  selectedVariantFromOptions,
  setOptimisticSelectedIndex,
  swatch,
}: ProductOptionValueLinkProps) {
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

  const isOptimisticSelected = index === optimisticSelectedIndex;
  const isVisiblySelected =
    isOptimisticSelected || (isSelected && optimisticSelectedIndex === -1);

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
