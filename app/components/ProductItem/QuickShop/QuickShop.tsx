import {useMemo} from 'react';
import {useSiteSettings} from '@pack/react';
import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';

import {AddToCart} from '~/components';
import {COLOR_OPTION_NAME} from '~/lib/constants';
import type {Group, SiteSettings} from '~/lib/types';

import {QuickShopOptions} from './QuickShopOptions';

interface QuickShopProps {
  enabledColorSelector?: boolean;
  grouping?: Group | null;
  selectedProduct: Product | null | undefined;
  selectedVariant: ProductVariant | null | undefined;
}

export function QuickShop({
  enabledColorSelector,
  grouping,
  selectedProduct,
  selectedVariant,
}: QuickShopProps) {
  const siteSettings = useSiteSettings() as SiteSettings;
  const {quickShopMultiText, quickShopSingleText} = {
    ...siteSettings?.settings?.collection?.productItem,
  };

  const qualifiesForQuickShop = useMemo(() => {
    if (!selectedProduct) return false;

    const initialOptions = grouping?.isReady
      ? grouping?.options
      : selectedProduct.options;
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
    const hasColorOptionWithMultipleValues = enabledColorSelector
      ? false
      : (grouping?.optionsMap?.[COLOR_OPTION_NAME] || []).length > 1 || false;

    return (
      (hasOnlySingleValueOptions || hasOnlyOneOptionWithMultipleValues) &&
      !hasColorOptionWithMultipleValues
    );
  }, [enabledColorSelector, grouping, selectedProduct?.id]);

  const hasOneVariant = selectedProduct?.variants?.nodes?.length === 1;

  return qualifiesForQuickShop && selectedVariant ? (
    <div className="mt-5 hidden opacity-0 transition group-hover:opacity-100 md:block lg:mt-6">
      {hasOneVariant && (
        <AddToCart
          addToCartText={quickShopSingleText}
          className="btn-inverse-dark"
          selectedVariant={selectedVariant}
        />
      )}

      {selectedProduct && !hasOneVariant && (
        <QuickShopOptions
          grouping={grouping}
          quickShopMultiText={quickShopMultiText}
          selectedProduct={selectedProduct}
          selectedVariant={selectedVariant}
        />
      )}
    </div>
  ) : null;
}

QuickShop.displayName = 'QuickShop';
