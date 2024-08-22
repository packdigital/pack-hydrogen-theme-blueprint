import {useMemo} from 'react';
import {useLocation} from '@remix-run/react';
import type {ProductOptionValue} from '@shopify/hydrogen/storefront-api-types';

import {Link} from '~/components';
import type {SelectedVariant, Swatch} from '~/lib/types';

import type {OnSelect} from '../ProductOptions';

import {InnerColorOptionValue} from './InnerColorOptionValue';
import {InnerOptionValue} from './InnerOptionValue';

interface ProductOptionValueLinkProps {
  isAvailable: boolean;
  isColor: boolean;
  isDisabled: boolean;
  isSelected: boolean;
  onSelect?: OnSelect;
  optionName: string;
  optionValue: ProductOptionValue;
  selectedVariantFromOptions: SelectedVariant;
  swatch?: Swatch | null;
}

export function ProductOptionValueLink({
  isAvailable,
  isColor,
  isDisabled,
  isSelected,
  onSelect,
  optionName,
  optionValue,
  selectedVariantFromOptions,
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

  return (
    <Link
      aria-label={optionValue.name}
      preventScrollReset
      to={url}
      onClick={() => {
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
          isSelected={isSelected}
          swatch={swatch}
          optionValue={optionValue}
        />
      ) : (
        <InnerOptionValue
          isAvailable={isAvailable}
          isDisabled={isDisabled}
          isSelected={isSelected}
          optionValue={optionValue}
        />
      )}
    </Link>
  );
}

ProductOptionValueLink.displayName = 'ProductOptionValueLink';
