import {useCallback, useEffect, useMemo, useState} from 'react';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

import {COLOR_OPTION_NAME} from '~/lib/constants';
import type {Group, SelectedProduct, SelectedVariant} from '~/lib/types';

import {ColorVariantOption} from './ColorVariantOption';

interface ColorVariantOptionsProps {
  enabledColorNameOnHover?: boolean;
  grouping?: Group | null;
  initialProduct: SelectedProduct;
  initialProductColorOptions: string[];
  selectedVariant: SelectedVariant;
  setProductFromColorSelector: (product: SelectedProduct) => void;
  setVariantFromColorSelector: (variant: SelectedVariant) => void;
  swatchesMap?: Record<string, string>;
}

type ProductMapByColor = Record<string, Product>;
type VariantMapByColor = Record<string, SelectedVariant>;

export function ColorVariantOptions({
  enabledColorNameOnHover,
  grouping,
  initialProduct,
  initialProductColorOptions,
  selectedVariant,
  setProductFromColorSelector,
  setVariantFromColorSelector,
  swatchesMap,
}: ColorVariantOptionsProps) {
  const [maxCount, setMaxCount] = useState(7);
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

  const selectedVariantColor = useMemo(() => {
    return selectedVariant?.selectedOptions.find(
      (option) => option.name === COLOR_OPTION_NAME,
    )?.value;
  }, [selectedVariant]);

  const generateProductMapByColor = useCallback(async () => {
    const groupingProducts = Object.values({
      ...grouping?.productsMap,
    });
    if (!groupingProducts.length) return;
    const _productMapByColor = groupingProducts.reduce(
      (acc: ProductMapByColor, groupProduct) => {
        const color = groupProduct?.options.find(({name}) => {
          return name === COLOR_OPTION_NAME;
        })?.values?.[0];
        if (!color) return acc;
        return {...acc, [color]: groupProduct};
      },
      {},
    );
    setProductMapByColor(_productMapByColor);
  }, [grouping?.productsMap]);

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

  const handleOptionClick = useCallback(
    (color: string) => {
      if (grouping) {
        if (!productMapByColor) return;
        setProductFromColorSelector(productMapByColor[color]);
        setVariantFromColorSelector(
          productMapByColor[color]?.variants?.nodes?.[0],
        );
      } else {
        setProductFromColorSelector(initialProduct);
        setVariantFromColorSelector(variantMapByColor?.[color]);
      }
    },
    [grouping, productMapByColor, variantMapByColor],
  );

  useEffect(() => {
    generateProductMapByColor();
    generateVariantMapByColor();
  }, [grouping, initialProduct]);

  const slicedColorOptions: string[] = colorOptions.slice(0, maxCount);
  const remainingColorCount = colorOptions.length - slicedColorOptions.length;

  return (
    <ul className="flex flex-wrap gap-1">
      {slicedColorOptions.map((color, index) => {
        return (
          <li key={index}>
            <ColorVariantOption
              color={color}
              enabledColorNameOnHover={enabledColorNameOnHover}
              onClick={() => handleOptionClick(color)}
              selectedVariantColor={selectedVariantColor}
              swatchesMap={swatchesMap}
            />
          </li>
        );
      })}

      {remainingColorCount > 0 && (
        <li className="flex">
          <button
            aria-label={`Show ${remainingColorCount} more color options`}
            className="whitespace-nowrap text-2xs"
            onClick={() => setMaxCount(colorOptions.length)}
            type="button"
          >
            + {remainingColorCount} more
          </button>
        </li>
      )}
    </ul>
  );
}

ColorVariantOptions.displayName = 'ColorVariantOptions';
