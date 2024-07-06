import {useMemo, useState} from 'react';

import {COLOR_OPTION_NAME} from '~/lib/constants';
import type {
  Group,
  SelectedProduct,
  SelectedVariant,
  SwatchesMap,
} from '~/lib/types';

import {ColorVariantOption} from './ColorVariantOption';
import {useColorVariantOptions} from './useColorVariantOptions';

interface ColorVariantOptionsProps {
  enabledColorNameOnHover?: boolean;
  grouping?: Group | null;
  initialProduct: SelectedProduct;
  initialProductColorOptions: string[];
  selectedVariant: SelectedVariant;
  setProductFromColorSelector: (product: SelectedProduct) => void;
  setVariantFromColorSelector: (variant: SelectedVariant) => void;
  swatchesMap?: SwatchesMap;
}

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
  const {colorOptions, productMapByColor, variantMapByColor} =
    useColorVariantOptions({
      grouping,
      initialProduct,
      initialProductColorOptions,
    });

  const [maxCount, setMaxCount] = useState(7);

  const selectedVariantColor = useMemo(() => {
    return selectedVariant?.selectedOptions.find(
      (option) => option.name === COLOR_OPTION_NAME,
    )?.value;
  }, [selectedVariant]);

  const slicedColorOptions: string[] = colorOptions.slice(0, maxCount);
  const remainingColorCount = colorOptions.length - slicedColorOptions.length;

  return (
    <ul className="flex flex-wrap gap-1">
      {slicedColorOptions.map((color, index) => {
        const productForColor = grouping
          ? productMapByColor?.[color]
          : initialProduct;
        const variantForColor = grouping
          ? productForColor?.variants?.nodes?.[0]
          : variantMapByColor?.[color];

        return productForColor && variantForColor ? (
          <li key={index}>
            <ColorVariantOption
              color={color}
              enabledColorNameOnHover={enabledColorNameOnHover}
              onClick={() => {
                setProductFromColorSelector(productForColor);
                setVariantFromColorSelector(variantForColor);
              }}
              selectedVariantColor={selectedVariantColor}
              swatchesMap={swatchesMap}
            />
          </li>
        ) : null;
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
