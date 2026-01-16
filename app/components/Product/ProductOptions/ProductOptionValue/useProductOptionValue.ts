import {useMemo} from 'react';
import type {
  ProductOptionValue,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';

import {COLOR_OPTION_NAME} from '~/lib/constants';
import type {ProductWithGrouping, SelectedVariant} from '~/lib/types';

interface UseProductOptionValueProps {
  name: string;
  optionValue: ProductOptionValue;
  product: ProductWithGrouping;
  selectedOptionsMap?: Record<string, string> | null;
  variantMap?: Map<string, ProductVariant>;
}

interface UseProductOptionValueReturn {
  isAvailable: boolean;
  isColor: boolean;
  isDisabled: boolean;
  isFromGrouping: boolean;
  isSelected: boolean;
  selectedVariantFromOptions: SelectedVariant;
}

export function useProductOptionValue({
  name,
  optionValue,
  product,
  selectedOptionsMap,
  variantMap,
}: UseProductOptionValueProps): UseProductOptionValueReturn {
  const newSelectedOptionsString = useMemo(() => {
    return selectedOptionsMap
      ? Object.entries({...selectedOptionsMap, [name]: optionValue.name})
          .map(([optionName, value]) => `${optionName}:${value}`)
          .sort()
          .join('|')
      : '';
  }, [name, selectedOptionsMap, optionValue.name]);

  const selectedVariantFromOptions = useMemo(() => {
    if (!newSelectedOptionsString) return null;

    // if product has no grouping, find match within product variants
    if (!product.grouping) {
      return variantMap?.get(newSelectedOptionsString) || null;
    }

    return product.grouping.variantMap?.get(newSelectedOptionsString) || null;
  }, [newSelectedOptionsString, product.id, optionValue.name, variantMap]);

  const isAvailable = !!selectedVariantFromOptions?.availableForSale;
  const isColor = name === COLOR_OPTION_NAME;
  const isDisabled = !selectedVariantFromOptions;
  const isSelected = Boolean(selectedOptionsMap?.[name] === optionValue.name);
  // if option value is from the grouping, or is the selected option value itself within the grouping
  const isFromGrouping = Boolean(
    // if option value variant's product id is different from current product id
    selectedVariantFromOptions?.product?.id !== product.id ||
      // if the option is selected, is color and product has grouping
      (isSelected && !!product.grouping && isColor),
  );

  return {
    isAvailable,
    isColor,
    isDisabled,
    isFromGrouping,
    isSelected,
    selectedVariantFromOptions,
  };
}
