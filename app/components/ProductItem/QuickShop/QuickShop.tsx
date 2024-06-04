import {useMemo} from 'react';
import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';

import {AddToCart} from '~/components';
import {COLOR_OPTION_NAME} from '~/lib/constants';
import {useSettings} from '~/hooks';

import {QuickShopOptions} from './QuickShopOptions';

interface QuickShopProps {
  enabledColorSelector?: boolean;
  quickShopMobileHidden?: boolean;
  selectedProduct: Product | null | undefined;
  selectedVariant: ProductVariant | null | undefined;
}

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
        return option.values.length === 1;
      }) || false;
    const hasOnlyOneOptionWithMultipleValues =
      options?.reduce((acc, option) => {
        return acc + (option.values.length > 1 ? 1 : 0);
      }, 0) === 1 || false;

    return hasOnlySingleValueOptions || hasOnlyOneOptionWithMultipleValues;
  }, [enabledColorSelector, selectedProduct?.id]);

  const hasOneVariant = selectedProduct?.variants?.nodes?.length === 1;

  return qualifiesForQuickShop && selectedVariant ? (
    <div
      className={`mt-5 transition md:block md:opacity-0 md:group-hover:opacity-100 lg:mt-6 ${
        quickShopMobileHidden ? 'max-md:hidden' : ''
      }`}
    >
      {hasOneVariant && (
        <AddToCart
          addToCartText={quickShopSingleText}
          className="btn-inverse-dark"
          selectedVariant={selectedVariant}
        />
      )}

      {selectedProduct && !hasOneVariant && (
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
