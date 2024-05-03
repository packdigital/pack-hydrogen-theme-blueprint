import {useCallback, useEffect, useMemo, useState} from 'react';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

import {COLOR_OPTION_NAME} from '~/lib/constants';
import type {Group, SelectedProduct, SelectedVariant} from '~/lib/types';

interface UseColorVariantOptionsProps {
  grouping?: Group | null;
  initialProduct: SelectedProduct;
  initialProductColorOptions: string[];
}

type ProductMapByColor = Record<string, Product>;
type VariantMapByColor = Record<string, SelectedVariant>;

export function useColorVariantOptions({
  grouping,
  initialProduct,
  initialProductColorOptions,
}: UseColorVariantOptionsProps) {
  const [productMapByColor, setProductMapByColor] =
    useState<ProductMapByColor | null>(null);
  const [variantMapByColor, setVariantMapByColor] = useState<
    VariantMapByColor | null | undefined
  >(null);

  const colorOptions = useMemo(() => {
    const originalColor = initialProductColorOptions[0];
    return grouping?.optionsMap
      ? [
          originalColor,
          ...grouping.optionsMap[COLOR_OPTION_NAME].filter(
            (color) => color !== originalColor,
          ),
        ]
      : initialProductColorOptions;
  }, [grouping, initialProductColorOptions]);

  const generateProductMapByColor = useCallback(async () => {
    const groupingProducts = Object.values({
      ...grouping?.productsByHandle,
    });
    if (!groupingProducts.length) return;

    // any intial product options that are not color and has only one value
    const initialProductSingleValueOptions = initialProduct?.options?.filter(
      (option) =>
        option.name !== COLOR_OPTION_NAME && option.values.length === 1,
    );

    const _productMapByColor = groupingProducts.reduce(
      (acc: ProductMapByColor, groupProduct) => {
        const colors = groupProduct?.options.find(({name}) => {
          return name === COLOR_OPTION_NAME;
        })?.values;
        if (!colors?.length) return acc;
        colors.forEach((color) => {
          if (acc[color]) return;
          // if no additional options to match, set as product
          if (!initialProductSingleValueOptions?.length) {
            acc[color] = groupProduct;
          }
          // if additional options to match, check if they match
          else {
            const groupProductMatchesInitialProduct =
              initialProductSingleValueOptions.every((option) => {
                const groupProductOption = groupProduct.options.find(
                  (groupOption) => groupOption.name === option.name,
                );
                return (
                  groupProductOption?.values[0] === option.values[0] &&
                  groupProductOption?.values.length === 1
                );
              });
            // if all additional options match, set as product
            if (groupProductMatchesInitialProduct) {
              acc[color] = groupProduct;
            }
          }
        });
        return acc;
      },
      {},
    );
    setProductMapByColor(_productMapByColor);
  }, [grouping?.productsByHandle, initialProduct]);

  const generateVariantMapByColor = useCallback(() => {
    if (grouping) return;
    const _variantMapByColor = initialProduct?.variants?.nodes?.reduce(
      (acc: VariantMapByColor, variant) => {
        const variantColor = variant.selectedOptions.find((option) => {
          return option.name === COLOR_OPTION_NAME;
        })?.value;
        if (!variantColor) return acc;
        if (acc[variantColor]) return acc;
        return {
          ...acc,
          [variantColor]: variant,
        };
      },
      {},
    );
    setVariantMapByColor(_variantMapByColor);
  }, [grouping, initialProduct]);

  useEffect(() => {
    generateProductMapByColor();
    generateVariantMapByColor();
  }, [grouping, initialProduct]);

  return {colorOptions, productMapByColor, variantMapByColor};
}
