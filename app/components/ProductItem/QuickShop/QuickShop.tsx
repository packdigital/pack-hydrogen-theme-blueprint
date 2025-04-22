import {useMemo} from 'react';
import clsx from 'clsx';

import {AddToCart} from '~/components/AddToCart';
import {COLOR_OPTION_NAME} from '~/lib/constants';
import {useSettings} from '~/hooks';

import type {QuickShopProps} from '../ProductItem.types';

import {QuickShopOptions} from './QuickShopOptions';

export function QuickShop({
  enabledColorSelector,
  quickShopMobileHidden = true,
  selectedProduct,
  selectedVariant,
}: QuickShopProps) {
  const {collection: collectionSettings} = useSettings();
  const {quickShopMultiText, quickShopSingleText} = {
    ...collectionSettings?.productItem,
  };

  const qualifiesForQuickShop = useMemo(() => {
    if (!selectedProduct) return false;

    const initialOptions = selectedProduct.options;
    const options = enabledColorSelector
      ? initialOptions?.filter((option) => option.name !== COLOR_OPTION_NAME)
      : initialOptions;

    const hasOnlySingleValueOptions =
      options?.every((option) => {
        return option.optionValues.length === 1;
      }) || false;
    const hasOnlyOneOptionWithMultipleValues =
      options?.reduce((acc, option) => {
        return acc + (option.optionValues.length > 1 ? 1 : 0);
      }, 0) === 1 || false;

    return hasOnlySingleValueOptions || hasOnlyOneOptionWithMultipleValues;
  }, [enabledColorSelector, selectedProduct?.id]);

  const hasOneVariant = selectedProduct?.variants?.nodes?.length === 1;
  const hasOnlyColorOption =
    enabledColorSelector &&
    selectedProduct?.options?.length === 1 &&
    selectedProduct?.options[0].name === COLOR_OPTION_NAME;
  const usesAddToCart = hasOneVariant || hasOnlyColorOption;

  return qualifiesForQuickShop && selectedVariant ? (
    <div
      className={clsx(
        'mt-5 transition md:block md:opacity-0 md:group-hover:opacity-100 lg:mt-6',
        quickShopMobileHidden && 'max-md:hidden',
      )}
    >
      {usesAddToCart && (
        <AddToCart
          addToCartText={quickShopSingleText}
          className="btn-inverse-dark"
          selectedVariant={selectedVariant}
        />
      )}

      {selectedProduct && !usesAddToCart && (
        <QuickShopOptions
          quickShopMultiText={quickShopMultiText}
          quickShopMobileHidden={quickShopMobileHidden}
          selectedProduct={selectedProduct}
          selectedVariant={selectedVariant}
        />
      )}
    </div>
  ) : null;
}

QuickShop.displayName = 'QuickShop';
