import {useMemo} from 'react';
import {useLocation} from '@remix-run/react';

import {Link} from '~/components';
import type {SelectedVariant, Swatch} from '~/lib/types';

import {InnerColorOptionValue} from './InnerColorOptionValue';
import {InnerOptionValue} from './InnerOptionValue';

interface ProductOptionValueLinkProps {
  isAvailable: boolean;
  isColor: boolean;
  isDisabled: boolean;
  isSelected: boolean;
  selectedVariantFromOptions: SelectedVariant;
  swatch?: Swatch | null;
  value: string;
}

export function ProductOptionValueLink({
  isAvailable,
  isColor,
  isDisabled,
  isSelected,
  selectedVariantFromOptions,
  swatch,
  value,
}: ProductOptionValueLinkProps) {
  const {search} = useLocation();

  const url = useMemo(() => {
    if (!selectedVariantFromOptions) return null;
    const params = new URLSearchParams(search);
    selectedVariantFromOptions.selectedOptions.forEach(
      ({name: optionName, value: optionValue}) => {
        params.set(optionName, optionValue);
      },
    );
    return `/products/${selectedVariantFromOptions.product.handle}?${params}`;
  }, [search, selectedVariantFromOptions]);

  return (
    <Link aria-label={value} preventScrollReset to={url}>
      {isColor ? (
        <InnerColorOptionValue
          isAvailable={isAvailable}
          isDisabled={isDisabled}
          isSelected={isSelected}
          swatch={swatch}
          value={value}
        />
      ) : (
        <InnerOptionValue
          isAvailable={isAvailable}
          isDisabled={isDisabled}
          isSelected={isSelected}
          value={value}
        />
      )}
    </Link>
  );
}

ProductOptionValueLink.displayName = 'ProductOptionValueLink';
