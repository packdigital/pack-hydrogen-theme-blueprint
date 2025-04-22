import {useEffect, useMemo, useState} from 'react';
import clsx from 'clsx';

import {COLOR_OPTION_NAME} from '~/lib/constants';
import {useMenu} from '~/hooks';

import type {QuickShopOptionsProps} from '../ProductItem.types';

import {QuickShopOption} from './QuickShopOption';

export function QuickShopOptions({
  quickShopMultiText,
  quickShopMobileHidden,
  selectedProduct,
}: QuickShopOptionsProps) {
  const {cartOpen} = useMenu();

  const [optionsVisible, setOptionsVisible] = useState(false);

  const option = useMemo(() => {
    if (!selectedProduct) return {name: '', optionValues: [], text: ''};
    // Find first non-color option that has more than one value for quick shop
    const _option = selectedProduct.options?.find(({name, optionValues}) => {
      return name !== COLOR_OPTION_NAME && optionValues.length > 1;
    });
    return {
      name: _option?.name || '',
      optionValues: _option?.optionValues || [],
      text:
        quickShopMultiText?.replace('{{option}}', _option?.name || '') || '',
    };
  }, [quickShopMultiText, selectedProduct.id]);

  useEffect(() => {
    if (!quickShopMobileHidden && cartOpen) setOptionsVisible(false);
  }, [cartOpen]);

  return (
    <div className="group/quickshop relative flex h-[3.125rem] w-full items-center justify-center overflow-hidden rounded border border-black">
      <p className="btn-text truncate px-3">{option.text}</p>

      <ul
        className={clsx(
          'invisible absolute inset-0 grid size-full bg-background group-focus/quickshop:visible md:group-hover/quickshop:visible',
          optionsVisible && 'max-md:visible',
        )}
        style={{
          gridTemplateColumns: `repeat(${option.optionValues.length}, 1fr)`,
        }}
      >
        {option.optionValues.map((optionValue) => {
          return (
            <li
              key={optionValue.name}
              className="overflow-hidden border-r border-black last:border-none"
            >
              <QuickShopOption
                optionName={option.name}
                selectedProduct={selectedProduct}
                optionValue={optionValue}
              />
            </li>
          );
        })}
      </ul>

      {!quickShopMobileHidden && (
        <button
          aria-label="Show quick add options"
          className={clsx(
            'absolute inset-0 z-[1] size-full md:hidden',
            optionsVisible && 'hidden',
          )}
          onClick={() => setOptionsVisible(!optionsVisible)}
          type="button"
        />
      )}
    </div>
  );
}

QuickShopOptions.displayName = 'QuickShopOptions';
