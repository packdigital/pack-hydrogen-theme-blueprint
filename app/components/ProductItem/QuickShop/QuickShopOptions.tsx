import {memo, useEffect, useState} from 'react';
import clsx from 'clsx';

import {COLOR_OPTION_NAME} from '~/lib/constants';
import {useMenu} from '~/hooks';

import type {QuickShopOptionsProps} from '../ProductItem.types';

import {QuickShopOption} from './QuickShopOption';

export const QuickShopOptions = memo(
  ({
    quickShopMultiText,
    quickShopMobileHidden,
    selectedProduct,
  }: QuickShopOptionsProps) => {
    const {cartOpen} = useMenu();

    const [optionsVisible, setOptionsVisible] = useState(false);

    // Find first non-color option that has more than one value for quick shop
    const _option = selectedProduct?.options?.find(({name, optionValues}) => {
      return name !== COLOR_OPTION_NAME && optionValues.length > 1;
    });
    const option = {
      name: _option?.name || '',
      optionValues: _option?.optionValues || [],
      text: selectedProduct
        ? quickShopMultiText?.replace('{{option}}', _option?.name || '') || ''
        : '',
    };

    useEffect(() => {
      if (!quickShopMobileHidden && cartOpen) setOptionsVisible(false);
    }, [cartOpen]);

    return (
      <div className="group/quickshop relative flex h-[3.125rem] w-full items-center justify-center overflow-hidden rounded border border-black">
        <p className="btn-text truncate px-3">{option.text}</p>

        {/*
         * Desktop: revealed on hover, and on keyboard focus (opacity rather
         * than visibility keeps the options focusable, WCAG 2.1.1).
         * Mobile: revealed by the toggle button below.
         */}
        <ul
          aria-label={option.name}
          className={clsx(
            'absolute inset-0 grid size-full bg-background md:opacity-0 md:focus-within:opacity-100 md:group-hover/quickshop:opacity-100',
            optionsVisible ? 'max-md:visible' : 'max-md:invisible',
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
            aria-expanded={optionsVisible}
            aria-label={`Show quick add ${option.name || 'options'}`}
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
  },
);

QuickShopOptions.displayName = 'QuickShopOptions';
