import type {Swatch} from '~/lib/types';

import {InnerColorOptionValue} from './InnerColorOptionValue';
import {InnerOptionValue} from './InnerOptionValue';

interface ProductOptionValueButtonProps {
  isAvailable: boolean;
  isColor: boolean;
  isDisabled: boolean;
  isSelected: boolean;
  name: string;
  setSelectedOption: (name: string, value: string) => void;
  swatch?: Swatch | null;
  value: string;
}

export function ProductOptionValueButton({
  isAvailable,
  isColor,
  isDisabled,
  isSelected,
  name,
  setSelectedOption,
  swatch,
  value,
}: ProductOptionValueButtonProps) {
  return (
    <button
      aria-label={value}
      disabled={isDisabled}
      onClick={() => {
        if (isSelected) return;
        setSelectedOption(name, value);
      }}
      type="button"
    >
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
    </button>
  );
}

ProductOptionValueButton.displayName = 'ProductOptionValueButton';
