import {useCallback, useMemo} from 'react';
import {useSearchParams} from '@remix-run/react';
import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen-react/storefront-api-types';

import {MODAL_PRODUCT_URL_PARAM} from '~/lib/constants';

export function useProductModal(
  {
    isShoppableProductItem = true,
    product,
    selectedVariant,
    additionalParams,
  }: {
    isShoppableProductItem?: boolean;
    product?: Product | null;
    selectedVariant?: ProductVariant | null;
    additionalParams?: Record<string, string>;
  } = {product: null, selectedVariant: null},
) {
  const [searchParams, setSearchParams] = useSearchParams();

  const openProductUrl = useMemo(() => {
    if (!isShoppableProductItem) return '';
    const handle = selectedVariant?.product?.handle || product?.handle;
    if (!handle) return '';
    const variantParams = new URLSearchParams();
    if (selectedVariant?.selectedOptions) {
      selectedVariant.selectedOptions.forEach(({name, value}) => {
        variantParams.set(name, value);
      });
    }
    const productParam = `${handle}${variantParams ? `?${variantParams}` : ''}`;
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set(MODAL_PRODUCT_URL_PARAM, productParam);
    if (additionalParams) {
      Object.entries(additionalParams).forEach(([key, value]) => {
        newSearchParams.set(key, value);
      });
    }
    return `?${newSearchParams}`;
  }, [
    isShoppableProductItem,
    product?.handle,
    selectedVariant?.id,
    searchParams,
    JSON.stringify(additionalParams),
  ]);

  const closeProductUrl = useMemo(() => {
    if (product || !searchParams) return '';
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete(MODAL_PRODUCT_URL_PARAM);
    return `?${newSearchParams}`;
  }, [searchParams]);

  const closeProductModal = useCallback(() => {
    searchParams.delete(MODAL_PRODUCT_URL_PARAM);
    setSearchParams(searchParams);
  }, [searchParams]);

  return {
    openProductUrl,
    closeProductUrl,
    closeProductModal,
  };
}
