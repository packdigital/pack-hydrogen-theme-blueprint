import {useMemo, useState} from 'react';

import {BYOBQuickShopOption} from './BYOBQuickShopOption';
import type {BYOBQuickShopOptionsProps} from './BYOBProductItem.types';

export function BYOBQuickShopOptions({
  bundle,
  bundleMapById,
  handleAddToBundle,
  handleRemoveFromBundle,
  incrementDisabled,
  product,
}: BYOBQuickShopOptionsProps) {
  const [activeQtySelectorIndex, setActiveQtySelectorIndex] = useState<
    number | null
  >(null);
  const option = useMemo(() => {
    if (!product) return {name: '', values: [], text: ''};
    const _option = product.options?.find(({values}) => {
      return values.length > 1;
    });
    return {
      name: _option?.name || '',
      values: _option?.values || [],
    };
  }, [product?.id]);

  return (
    <div className="relative flex h-12 w-full items-center justify-center overflow-hidden rounded border border-black bg-background">
      <ul
        className="scrollbar-hide grid h-full flex-1 overflow-y-auto"
        style={{
          gridTemplateColumns: `repeat(${option.values.length}, 1fr)`,
        }}
      >
        {option.values.map((value, index) => {
          return (
            <li
              key={value}
              className="min-w-5 border-r border-black last:border-none"
            >
              <BYOBQuickShopOption
                activeQtySelectorIndex={activeQtySelectorIndex}
                setActiveQtySelectorIndex={setActiveQtySelectorIndex}
                bundle={bundle}
                bundleMapById={bundleMapById}
                handleRemoveFromBundle={handleRemoveFromBundle}
                incrementDisabled={incrementDisabled}
                index={index}
                handleAddToBundle={handleAddToBundle}
                optionName={option.name}
                product={product}
                value={value}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

BYOBQuickShopOptions.displayName = 'BYOBQuickShopOptions';
