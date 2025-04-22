import {memo, useCallback, useMemo, useState} from 'react';
import {useInView} from 'react-intersection-observer';
import {useAnalytics} from '@shopify/hydrogen';

import {COLOR_OPTION_NAME} from '~/lib/constants';
import {Link} from '~/components/Link';
import {ProductStars} from '~/components/ProductStars';
import {AnalyticsEvent} from '~/components/Analytics/constants';
import {
  useParsedProductMetafields,
  useProductByHandle,
  useProductGroupingByHandle,
  useProductModal,
} from '~/hooks';
import type {SelectedProduct, SelectedVariant} from '~/lib/types';

import {ColorVariantSelector} from './ColorVariantSelector';
import {ProductItemMedia} from './ProductItemMedia/ProductItemMedia';
import {ProductItemPrice} from './ProductItemPrice';
import {QuickShop} from './QuickShop';
import type {ProductItemProps} from './ProductItem.types';

export const ProductItem = memo(
  ({
    enabledColorNameOnHover,
    enabledColorSelector,
    enabledQuickShop,
    enabledStarRating,
    handle: passedHandle,
    index,
    isShoppableProductItem = false,
    onClick,
    priority,
    product: passedProduct,
    quickShopMobileHidden,
    searchTerm,
    swatchesMap,
  }: ProductItemProps) => {
    const {ref: inViewRef, inView} = useInView({
      rootMargin: '200px',
      triggerOnce: true,
    });
    const {publish, shop} = useAnalytics();
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

    /* Product metafields parsed into an object with metafields by `${namespace}.${key}` */
    const metafields = useParsedProductMetafields(selectedProduct);

    const handle = passedHandle || initialProduct?.handle;

    const grouping = useProductGroupingByHandle(
      enabledColorSelector && (priority || inView) ? handle : null,
    );

    const {openProductUrl} = useProductModal({
      isShoppableProductItem,
      product: selectedProduct,
      selectedVariant,
    });

    const productUrl = useMemo(() => {
      if (openProductUrl) return openProductUrl;
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
    }, [openProductUrl, selectedVariant]);

    const color = useMemo(() => {
      return selectedVariant?.selectedOptions.find(
        (option) => option.name === COLOR_OPTION_NAME,
      )?.value;
    }, [selectedVariant]);

    const title = selectedProduct?.title;

    const handleClick = useCallback(() => {
      publish(AnalyticsEvent.PRODUCT_ITEM_CLICKED, {
        listIndex: index,
        product: selectedProduct,
        selectedVariant,
        searchTerm,
        shop,
      });
      if (typeof onClick === 'function') onClick();
    }, [index, publish, selectedProduct?.id, selectedVariant?.id, searchTerm]);

    return (
      <div className="group relative flex flex-col gap-2" ref={inViewRef}>
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

          {color && <p className="text-sm text-neutralMedium">{color}</p>}

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
  },
);

ProductItem.displayName = 'ProductItem';
