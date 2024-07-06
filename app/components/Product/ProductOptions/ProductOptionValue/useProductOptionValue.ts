import {useMemo} from 'react';
import equal from 'fast-deep-equal';

import {COLOR_OPTION_NAME} from '~/lib/constants';
import type {ProductWithGrouping, SelectedVariant} from '~/lib/types';

interface UseProductOptionValueProps {
  name: string;
  product: ProductWithGrouping;
  selectedOptionsMap: Record<string, string>;
  value: string;
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
  product,
  selectedOptionsMap,
  value,
}: UseProductOptionValueProps): UseProductOptionValueReturn {
  const newSelectedOptions = useMemo(() => {
    return selectedOptionsMap ? {...selectedOptionsMap, [name]: value} : null;
  }, [name, selectedOptionsMap, value]);

  const selectedVariantFromOptions = useMemo(() => {
    if (!newSelectedOptions) return null;

    const newSelectedOptionsEntries = Object.entries(newSelectedOptions);

    // if product has no grouping, find match within product variants
    if (!product.grouping) {
      return product.variants.nodes.find(({selectedOptions}) => {
        const selectedOptionsMap = selectedOptions.reduce(
          (acc, {name: optionName, value: optionValue}) => {
            return {...acc, [optionName]: optionValue};
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
          .every(([optionName, optionValue]) => {
            return productsByOptionValue[optionName]?.[optionValue]?.some(
              (valueProduct) => valueProduct.id === firstValueProduct.id,
            );
          });
      },
    );

    if (!selectedProductFromOptions) return null;

    // find variant that matches all selected options from selected product
    const selectedVariant = selectedProductFromOptions?.variants.nodes.find(
      ({selectedOptions}) => {
        const selectedOptionsMap = selectedOptions.reduce(
          (acc, {name: optionName, value: optionValue}) => {
            return {...acc, [optionName]: optionValue};
          },
          {},
        );
        return equal(newSelectedOptions, selectedOptionsMap);
      },
    );

    return selectedVariant;
  }, [newSelectedOptions, product.id, value]);

  const isAvailable = !!selectedVariantFromOptions?.availableForSale;
  const isColor = name === COLOR_OPTION_NAME;
  const isDisabled = !selectedVariantFromOptions;
  const isFromGrouping = Boolean(
    selectedVariantFromOptions?.product?.id !== product.id,
  );
  const isSelected = Boolean(selectedOptionsMap?.[name] === value);

  return {
    isAvailable,
    isColor,
    isDisabled,
    isFromGrouping,
    isSelected,
    selectedVariantFromOptions,
  };
}
