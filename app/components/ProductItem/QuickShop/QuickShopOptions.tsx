import {useMemo} from 'react';
import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';

import {COLOR_OPTION_NAME} from '~/lib/constants';
import type {Group} from '~/lib/types';

import {QuickShopOption} from './QuickShopOption';

interface QuickShopOptionsProps {
  grouping?: Group | null;
  quickShopMultiText: string;
  selectedProduct: Product;
  selectedVariant: ProductVariant;
}

export function QuickShopOptions({
  grouping,
  quickShopMultiText,
  selectedProduct,
}: QuickShopOptionsProps) {
  const option = useMemo(() => {
    if (!selectedProduct) return {name: '', values: [], text: ''};
    const options = grouping?.isReady
      ? grouping?.options
      : selectedProduct.options;
    const _option = options?.find(({name}) => name !== COLOR_OPTION_NAME);
    return {
      name: _option?.name || '',
      values: _option?.values || [],
      text:
        quickShopMultiText?.replace('{{option}}', _option?.name || '') || '',
    };
  }, [grouping, quickShopMultiText, selectedProduct.id]);

  return (
    <div className="group/quickshop relative flex h-[3.125rem] w-full items-center justify-center overflow-hidden rounded border border-black">
      <p className="btn-text truncate px-3">{option.text}</p>

      <ul
        className="invisible absolute inset-0 grid h-full w-full bg-background group-hover/quickshop:visible group-focus/quickshop:visible"
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
