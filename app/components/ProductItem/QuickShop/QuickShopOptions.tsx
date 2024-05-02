import {useMemo} from 'react';
import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';

import {PRIMARY_OPTION_NAME} from '~/lib/constants';

import {QuickShopOption} from './QuickShopOption';

interface QuickShopOptionsProps {
  quickShopMultiText: string;
  selectedProduct: Product;
  selectedVariant: ProductVariant;
}

export function QuickShopOptions({
  quickShopMultiText,
  selectedProduct,
}: QuickShopOptionsProps) {
  const option = useMemo(() => {
    if (!selectedProduct) return {name: '', values: [], text: ''};
    // Find first non-color option that has more than one value for quick shop
    const _option = selectedProduct.options?.find(({name, values}) => {
      return name !== PRIMARY_OPTION_NAME && values.length > 1;
    });
    return {
      name: _option?.name || '',
      values: _option?.values || [],
      text:
        quickShopMultiText?.replace('{{option}}', _option?.name || '') || '',
    };
  }, [quickShopMultiText, selectedProduct.id]);

  return (
    <div className="group/quickshop relative flex h-[3.125rem] w-full items-center justify-center overflow-hidden rounded border border-black">
      <p className="btn-text truncate px-3">{option.text}</p>

      <ul
        className="invisible absolute inset-0 grid size-full bg-background group-focus/quickshop:visible md:group-hover/quickshop:visible"
        style={{
          gridTemplateColumns: `repeat(${option.values.length}, 1fr)`,
        }}
      >
        {option.values.map((value) => {
          return (
            <li
              key={value}
              className="overflow-hidden border-r border-black last:border-none"
            >
              <QuickShopOption
                optionName={option.name}
                selectedProduct={selectedProduct}
                value={value}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

QuickShopOptions.displayName = 'QuickShopOptions';
