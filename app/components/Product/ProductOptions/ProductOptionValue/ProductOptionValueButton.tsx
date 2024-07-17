import type {ProductOptionValue} from '@shopify/hydrogen/storefront-api-types';

import type {Swatch} from '~/lib/types';

import {InnerColorOptionValue} from './InnerColorOptionValue';
import {InnerOptionValue} from './InnerOptionValue';

interface ProductOptionValueButtonProps {
  isAvailable: boolean;
  isColor: boolean;
  isDisabled: boolean;
  isSelected: boolean;
  name: string;
  optionValue: ProductOptionValue;
  setSelectedOption: (name: string, value: string) => void;
  swatch?: Swatch | null;
}

export function ProductOptionValueButton({
  isAvailable,
  isColor,
  isDisabled,
  isSelected,
  name,
  optionValue,
  setSelectedOption,
  swatch,
}: ProductOptionValueButtonProps) {
  return (
    <button
      aria-label={optionValue.name}
      disabled={isDisabled}
      onClick={() => {
        if (isSelected) return;
        setSelectedOption(name, optionValue.name);
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
