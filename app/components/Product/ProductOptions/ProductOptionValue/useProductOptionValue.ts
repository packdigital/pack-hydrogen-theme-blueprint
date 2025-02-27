import {useMemo} from 'react';
import equal from 'fast-deep-equal';
import type {ProductOptionValue} from '@shopify/hydrogen/storefront-api-types';

import {COLOR_OPTION_NAME} from '~/lib/constants';
import type {ProductWithGrouping, SelectedVariant} from '~/lib/types';

interface UseProductOptionValueProps {
  name: string;
  optionValue: ProductOptionValue;
  product: ProductWithGrouping;
  selectedOptionsMap?: Record<string, string> | null;
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
}: UseProductOptionValueProps): UseProductOptionValueReturn {
  const newSelectedOptions = useMemo(() => {
    return selectedOptionsMap
      ? {...selectedOptionsMap, [name]: optionValue.name}
      : null;
  }, [name, selectedOptionsMap, optionValue.name]);

  const selectedVariantFromOptions = useMemo(() => {
    if (!newSelectedOptions) return null;

    const newSelectedOptionsEntries = Object.entries(newSelectedOptions);

    // if product has no grouping, find match within product variants
    if (!product.grouping) {
      return product.variants?.nodes.find(({selectedOptions}) => {
        const selectedOptionsMap = selectedOptions.reduce(
          (acc, {name: optionName, value}) => {
            return {...acc, [optionName]: value};
          },
          {},
        );
        return equal(newSelectedOptions, selectedOptionsMap);
      });
    }

    const productsByOptionValue = product.grouping.productsByOptionValue;
    let selectedProductFromOptions: ProductWithGrouping | null | undefined =
      null;

    const [firstOptionName, firstOptionValue] = newSelectedOptionsEntries[0];
    const firstOptionValueProducts =
      productsByOptionValue?.[firstOptionName]?.[firstOptionValue];

    if (!firstOptionValueProducts) return null;

    // find product that has all selected options
    selectedProductFromOptions = firstOptionValueProducts.find(
      (firstValueProduct) => {
        return newSelectedOptionsEntries
          .slice(1)
          .every(([optionName, value]) => {
            return productsByOptionValue[optionName]?.[value]?.some(
              (valueProduct) => valueProduct.id === firstValueProduct.id,
            );
          });
      },
    );

    if (!selectedProductFromOptions) return null;

    // find variant that matches all selected options from selected product
    const selectedVariant = selectedProductFromOptions?.variants?.nodes.find(
      ({selectedOptions}) => {
        const selectedOptionsMap = selectedOptions.reduce(
          (acc, {name: optionName, value}) => {
            return {...acc, [optionName]: value};
          },
          {},
        );
        return equal(newSelectedOptions, selectedOptionsMap);
      },
    );

    return selectedVariant;
  }, [newSelectedOptions, product.id, optionValue.name]);

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
