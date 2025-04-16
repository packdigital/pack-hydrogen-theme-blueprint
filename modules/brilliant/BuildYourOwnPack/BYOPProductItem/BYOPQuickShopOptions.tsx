import {useMemo, useState} from 'react';

import {BYOPQuickShopOption} from './BYOPQuickShopOption';
import type {BYOPQuickShopOptionsProps} from './BYOPProductItem.types';

export function BYOPQuickShopOptions({
  bundle,
  bundleMapById,
  handleAddToBundle,
  handleRemoveFromBundle,
  incrementDisabled,
  product,
}: BYOPQuickShopOptionsProps) {
  const [activeQtySelectorIndex, setActiveQtySelectorIndex] = useState<
    number | null
  >(null);
  const option = useMemo(() => {
    if (!product) return {name: '', optionValues: [], text: ''};
    const _option = product.options?.find(({optionValues}) => {
      return optionValues.length > 1;
    });
    return {
      name: _option?.name || '',
      optionValues: _option?.optionValues || [],
    };
  }, [product?.id]);

  return (
    <div className="relative flex h-12 w-full items-center justify-center overflow-hidden rounded border border-black bg-background">
      <ul
        className="scrollbar-hide grid h-full flex-1 overflow-y-auto"
        style={{
          gridTemplateColumns: `repeat(${option.optionValues.length}, 1fr)`,
        }}
      >
        {option.optionValues.map((optionValue, index) => {
          return (
            <li
              key={optionValue.name}
              className="min-w-5 border-r border-black last:border-none"
            >
              <BYOPQuickShopOption
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
                optionValue={optionValue}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

BYOPQuickShopOptions.displayName = 'BYOPQuickShopOptions';
