import {useMemo} from 'react';
import clsx from 'clsx';

import {BackInStockModal} from '~/components/BackInStockModal';
import {Spinner} from '~/components/Animations';
import {useAddToCart} from '~/hooks';

import type {QuickShopOptionProps} from '../ProductItem.types';

export function QuickShopOption({
  optionName,
  selectedProduct,
  optionValue,
}: QuickShopOptionProps) {
  const variantToAdd = useMemo(() => {
    return selectedProduct.variants?.nodes?.find((variant) => {
      const variantOption = variant.selectedOptions?.find(
        (option) => option.name === optionName,
      )?.value;
      return variantOption === optionValue.name;
    });
  }, [optionName, selectedProduct, optionValue.name]);

  const {
    cartIsUpdating,
    isAdding,
    isNotifyMe,
    isSoldOut,
    handleAddToCart,
    handleNotifyMe,
  } = useAddToCart({
    quantity: 1,
    selectedVariant: variantToAdd,
  });

  const disabled = !variantToAdd;
  const isUpdatingClass = isAdding || cartIsUpdating ? 'cursor-default' : '';
  const validClass =
    disabled || (isSoldOut && !isNotifyMe)
      ? 'cursor-not-allowed'
      : 'md:hover:bg-black md:hover:text-white';
  const unavailableClass = isSoldOut
    ? 'after:h-px after:w-[150%] after:rotate-[135deg] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:bg-neutralLight text-neutralLight overflow-hidden'
    : '';

  return (
    <button
      aria-label={optionValue.name}
      className={clsx(
        'group/option relative flex size-full items-center justify-center whitespace-nowrap text-center text-sm transition',
        validClass,
        unavailableClass,
        isUpdatingClass,
      )}
      disabled={disabled || isSoldOut}
      onClick={() => {
        if (isNotifyMe) {
          handleNotifyMe(<BackInStockModal selectedVariant={variantToAdd} />);
        } else {
          handleAddToCart();
        }
      }}
      type="button"
    >
      {isAdding ? (
        <div className="text-neutralMedium md:group-hover/option:text-white">
          <Spinner width="20" />
        </div>
      ) : (
        optionValue.name
      )}
    </button>
  );
}

QuickShopOption.displayName = 'QuickShopOption';
