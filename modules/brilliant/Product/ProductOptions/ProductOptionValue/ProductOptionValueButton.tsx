import {useBrilliantColorSwatches} from 'modules/brilliant/hooks/useBrilliantColorSwatches';

import type {ProductOptionValueButtonProps} from './ProductOptionValue.types';

import {Button} from '~/components/ui/button';

export function ProductOptionValueButton({
  // isAvailable,
  // isColor,
  isDisabled,
  isSelected,
  onSelect,
  optionName,
  optionValue,
  selectedVariantFromOptions,
  setSelectedOption,
  // swatch,
  // optionsImageVariantMap,
  // hasLargeAmountOfVariants,
}: ProductOptionValueButtonProps) {
  /**
   * build our color swatch from our build in constants, requires this list be mainted but so be it
   */
  const {colorSwatch} = useBrilliantColorSwatches({
    colorName: optionValue?.name,
  });

  return (
    <Button
      aria-label={optionValue.name}
      variant={'outline'}
      className={`w-full justify-start border border-gray-300 ${isSelected && 'border-2 border-orange-500 bg-orange-200/50'}`}
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
      {colorSwatch && (
        <div className="relative size-6 shrink-0 overflow-hidden rounded-full border border-gray-200">
          <div className="flex size-full">
            {colorSwatch.map((color, idx) => (
              <div
                key={`${optionValue.name}-${idx}`}
                className="h-full"
                style={{
                  backgroundColor: color,
                  width: `${100 / colorSwatch.length}%`,
                }}
              />
            ))}
          </div>
        </div>
      )}
      <div className="truncate p-1">{optionValue.name}</div>
    </Button>
  );
}

ProductOptionValueButton.displayName = 'ProductOptionValueButton';
