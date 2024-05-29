import {useMemo} from 'react';
import {useLocation} from '@remix-run/react';

import {Link} from '~/components';
import type {I18nLocale, SelectedVariant} from '~/lib/types';

import {InnerColorOptionValue} from './InnerColorOptionValue';
import {InnerOptionValue} from './InnerOptionValue';
import type {Swatch} from './useProductOptionValue';

interface ProductOptionValueLinkProps {
  isAvailable: boolean;
  isColor: boolean;
  isDisabled: boolean;
  isSelected: boolean;
  pathPrefix: I18nLocale['pathPrefix'];
  selectedVariantFromOptions: SelectedVariant;
  swatch?: Swatch | null;
  value: string;
}

export function ProductOptionValueLink({
  isAvailable,
  isColor,
  isDisabled,
  isSelected,
  pathPrefix,
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
    return `${pathPrefix}/products/${selectedVariantFromOptions.product.handle}?${params}`;
  }, [pathPrefix, search, selectedVariantFromOptions]);

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
