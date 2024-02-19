import {useMemo} from 'react';
import equal from 'fast-deep-equal';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

interface ProductOptionValueProps {
  isSelected: boolean;
  name: string;
  product: Product;
  selectedOptionsMap: Record<string, string>;
  setSelectedOption: (name: string, value: string) => void;
  value: string;
}

export function ProductOptionValue({
  isSelected,
  name,
  product,
  selectedOptionsMap,
  setSelectedOption,
  value,
}: ProductOptionValueProps) {
  const newSelectedOptions = useMemo(() => {
    return selectedOptionsMap ? {...selectedOptionsMap, [name]: value} : null;
  }, [name, selectedOptionsMap, value]);

  const variantFromOptionValue = useMemo(() => {
    return product.variants.nodes.find(({selectedOptions}) => {
      const _selectedOptionsMap = selectedOptions.reduce((acc, option) => {
        return {...acc, [option.name]: option.value};
      }, {});
      return equal(newSelectedOptions, _selectedOptionsMap);
    });
  }, [newSelectedOptions, product]);

  const disabled = !variantFromOptionValue;
  const optionValueIsAvailable = !!variantFromOptionValue?.availableForSale;

  const validClass = !disabled ? 'md:hover:border-text' : 'cursor-not-allowed';
  const unavailableClass =
    !optionValueIsAvailable && !disabled
      ? 'after:h-px after:w-[150%] after:rotate-[135deg] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:bg-mediumGray text-gray overflow-hidden'
      : '';
  const selectedClass = isSelected ? 'border-text' : '';

  return (
    <button
      aria-label={value}
      className={`relative h-10 min-w-[3.5rem] rounded border border-border px-3 transition ${validClass} ${unavailableClass} ${selectedClass}`}
      disabled={disabled}
      onClick={() => {
        if (isSelected) return;
        setSelectedOption(name, value);
      }}
      type="button"
    >
      {value}
    </button>
  );
}

ProductOptionValue.displayName = 'ProductOptionValue';
