import {useMemo} from 'react';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

import {BackInStockModal, Spinner} from '~/components';
import {useAddToCart} from '~/hooks';

interface QuickShopOptionsProps {
  optionName: string;
  selectedProduct: Product;
  value: string;
}

export function QuickShopOption({
  optionName,
  selectedProduct,
  value,
}: QuickShopOptionsProps) {
  const variantToAdd = useMemo(() => {
    return selectedProduct.variants?.nodes?.find((variant) => {
      const variantOption = variant.selectedOptions?.find(
        (option) => option.name === optionName,
      )?.value;
      return variantOption === value;
    });
  }, [optionName, selectedProduct, value]);

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
    ? 'after:h-px after:w-[150%] after:rotate-[135deg] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:bg-mediumGray text-gray overflow-hidden'
    : '';

  return (
    <button
      aria-label={value}
      className={`group/option relative flex size-full items-center justify-center whitespace-nowrap text-center text-sm transition ${validClass} ${unavailableClass} ${isUpdatingClass}`}
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
        <div className="text-mediumDarkGray md:group-hover/option:text-white">
          <Spinner width="20" />
        </div>
      ) : (
        value
      )}
    </button>
  );
}

QuickShopOption.displayName = 'QuickShopOption';
