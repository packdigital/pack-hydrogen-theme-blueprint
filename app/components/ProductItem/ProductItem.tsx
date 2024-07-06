import {useCallback, useMemo, useState} from 'react';
import {useInView} from 'react-intersection-observer';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

import {COLOR_OPTION_NAME} from '~/lib/constants';
import type {SelectedProduct, SelectedVariant, SwatchesMap} from '~/lib/types';
import {Link} from '~/components';
import {
  useDataLayerClickEvents,
  useProductByHandle,
  useProductGroupingByHandle,
} from '~/hooks';

import {ProductStars} from '../ProductStars';

import {ColorVariantSelector} from './ColorVariantSelector';
import {ProductItemMedia} from './ProductItemMedia/ProductItemMedia';
import {ProductItemPrice} from './ProductItemPrice';
import {QuickShop} from './QuickShop';

interface ProductItemProps {
  enabledColorNameOnHover?: boolean;
  enabledColorSelector?: boolean;
  enabledQuickShop?: boolean;
  enabledStarRating?: boolean;
  handle?: string;
  index: number;
  isSearchResults?: boolean;
  onClick?: () => void;
  priority?: boolean;
  product?: Product | null;
  quickShopMobileHidden?: boolean;
  searchTerm?: string;
  swatchesMap?: SwatchesMap;
}

export function ProductItem({
  enabledColorNameOnHover,
  enabledColorSelector,
  enabledQuickShop,
  enabledStarRating,
  handle: passedHandle,
  index,
  isSearchResults,
  onClick,
  priority,
  product: passedProduct,
  quickShopMobileHidden,
  searchTerm,
  swatchesMap,
}: ProductItemProps) {
  const {ref: inViewRef, inView} = useInView({
    rootMargin: '200px',
    triggerOnce: true,
  });
  const {sendClickProductItemEvent} = useDataLayerClickEvents();
  // if full product passed, don't query for it; only query when in view unless priority
  const queriedProduct = useProductByHandle(
    passedProduct ? null : priority || inView ? passedHandle : null,
  );

  const [productFromColorSelector, setProductFromColorSelector] =
    useState<SelectedProduct>(null);
  const [variantFromColorSelector, setVariantFromColorSelector] =
    useState<SelectedVariant>(null);

  const initialProduct = useMemo((): SelectedProduct => {
    return passedProduct || queriedProduct;
  }, [passedProduct, queriedProduct]);

  const selectedProduct = useMemo((): SelectedProduct => {
    return productFromColorSelector || initialProduct;
  }, [productFromColorSelector, initialProduct]);

  const selectedVariant = useMemo((): SelectedVariant => {
    return variantFromColorSelector || selectedProduct?.variants?.nodes?.[0];
  }, [variantFromColorSelector, selectedProduct]);

  const handle = passedHandle || initialProduct?.handle;

  const grouping = useProductGroupingByHandle(
    enabledColorSelector && (priority || inView) ? handle : null,
  );

  const color = useMemo(() => {
    return selectedVariant?.selectedOptions.find(
      (option) => option.name === COLOR_OPTION_NAME,
    )?.value;
  }, [selectedVariant]);

  const productUrl = useMemo(() => {
    const productHandle = selectedVariant?.product?.handle;
    if (!productHandle) return '';
    const searchParams = new URLSearchParams();
    selectedVariant.selectedOptions.forEach(({name, value}) => {
      if (name !== COLOR_OPTION_NAME) return;
      searchParams.set(name, value);
    });
    return `/products/${productHandle}${
      searchParams ? `?${searchParams}` : ''
    }`;
  }, [selectedVariant]);

  const title = selectedProduct?.title;

  const handleClick = useCallback(() => {
    sendClickProductItemEvent({
      isSearchResult: isSearchResults,
      listIndex: index,
      product: selectedProduct,
      searchTerm,
      selectedVariant,
    });
    if (typeof onClick === 'function') onClick();
  }, [index, selectedProduct?.id, selectedVariant?.id]);

  return (
    <div className="group flex h-full flex-col justify-between" ref={inViewRef}>
      <div className="flex flex-col items-start">
        <Link
          aria-label={title}
          className="mb-3 w-full"
          to={productUrl}
          onClick={handleClick}
          tabIndex={-1}
        >
          <ProductItemMedia
            hasGrouping={!!grouping}
            selectedProduct={selectedProduct}
            selectedVariant={selectedVariant}
          />
        </Link>

        {enabledStarRating && initialProduct?.id && (
          <div className="mb-1.5">
            <Link
              aria-label={`Reviews for ${title}`}
              to={productUrl}
              onClick={handleClick}
              tabIndex={-1}
            >
              <ProductStars id={initialProduct.id} />
            </Link>
          </div>
        )}

        <Link aria-label={title} to={productUrl} onClick={handleClick}>
          <h3 className="min-h-6 text-base">{title}</h3>
        </Link>

        {color && <p className="text-sm text-mediumDarkGray">{color}</p>}

        <ProductItemPrice selectedVariant={selectedVariant} />

        {enabledColorSelector && (
          <ColorVariantSelector
            enabledColorNameOnHover={enabledColorNameOnHover}
            grouping={grouping}
            initialProduct={initialProduct}
            selectedVariant={selectedVariant}
            setProductFromColorSelector={setProductFromColorSelector}
            setVariantFromColorSelector={setVariantFromColorSelector}
            swatchesMap={swatchesMap}
          />
        )}
      </div>

      {enabledQuickShop && (
        <QuickShop
          enabledColorSelector={enabledColorSelector}
          quickShopMobileHidden={quickShopMobileHidden}
          selectedProduct={selectedProduct}
          selectedVariant={selectedVariant}
        />
      )}
    </div>
  );
}

ProductItem.displayName = 'ProductItem';
