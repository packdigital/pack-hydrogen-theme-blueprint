import type {ProductOptionValue} from '@shopify/hydrogen/storefront-api-types';

import type {SelectedVariant, Swatch} from '~/lib/types';

import type {OnSelect} from '../ProductOptions';

import {InnerColorOptionValue} from './InnerColorOptionValue';
import {InnerOptionValue} from './InnerOptionValue';

interface ProductOptionValueButtonProps {
  isAvailable: boolean;
  isColor: boolean;
  isDisabled: boolean;
  isSelected: boolean;
  onSelect?: OnSelect;
  optionName: string;
  optionValue: ProductOptionValue;
  selectedVariantFromOptions: SelectedVariant;
  setSelectedOption: (name: string, value: string) => void;
  swatch?: Swatch | null;
}

export function ProductOptionValueButton({
  isAvailable,
  isColor,
  isDisabled,
  isSelected,
  onSelect,
  optionName,
  optionValue,
  selectedVariantFromOptions,
  setSelectedOption,
  swatch,
}: ProductOptionValueButtonProps) {
  return (
    <button
      aria-label={optionValue.name}
      disabled={isDisabled}
      onClick={() => {
        if (isSelected) return;
        setSelectedOption(optionName, optionValue.name);
        if (typeof onSelect === 'function') {
          onSelect({
            selectedVariant: selectedVariantFromOptions,
            optionName,
            optionValue,
          });
        }
      }}
      type="button"
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
    </button>
  );
}

ProductOptionValueButton.displayName = 'ProductOptionValueButton';
