import {useEffect, useMemo} from 'react';
import {useProduct} from '@shopify/hydrogen-react';

import {COLOR_OPTION_NAME} from '~/lib/constants';
import {useLocale, useParsedProductMetafields, useSettings} from '~/hooks';
import type {SelectedVariant} from '~/lib/types';

import {ProductDetails} from './ProductDetails';
import {ProductMetafields} from './ProductMetafields';
import {ProductHeader} from './ProductHeader';
import {ProductMedia} from './ProductMedia';
import type {ProductProps} from './Product.types';

export function Product({
  initialSelectedVariant,
  isModalProduct,
  isSectionProduct,
  product,
}: ProductProps) {
  const {selectedVariant: providerSelectedVariant} = useProduct() as {
    selectedVariant: SelectedVariant;
  };
  const {header, product: productSettings} = useSettings();
  const {pathPrefix} = useLocale();
  /* Product metafields parsed into an object with metafields by `${namespace}.${key}` */
  const metafields = useParsedProductMetafields(product);

  const selectedVariant = useMemo(() => {
    /* workaround because selected variant from useProduct hook is momentarily
     * misaligned with the product from the loader after navigation between
     * product pages */
    return !providerSelectedVariant ||
      providerSelectedVariant?.product?.id !== product.id
      ? initialSelectedVariant
      : providerSelectedVariant;
  }, [initialSelectedVariant, providerSelectedVariant, product]);

  const selectedVariantColor = useMemo(() => {
    return selectedVariant?.selectedOptions?.find(
      ({name}) => name === COLOR_OPTION_NAME,
    )?.value;
  }, [selectedVariant]);

  // set variant url param on selected variant change unless has one variant
  useEffect(() => {
    if (
      isModalProduct ||
      isSectionProduct ||
      product.variants?.nodes.length === 1 ||
      !selectedVariant
    )
      return;

    const {origin, search} = window.location;

    const params = new URLSearchParams(search);
    selectedVariant.selectedOptions?.forEach(({name, value}) => {
      params.set(name, value);
    });

    const updatedUrl = `${origin}${pathPrefix}/products/${product.handle}?${params}`;

    window.history.replaceState(window.history.state, '', updatedUrl);
  }, [isModalProduct, isSectionProduct, product.handle, selectedVariant?.id]);

  const stickyPromobar =
    header?.promobar?.enabled && !header?.promobar?.autohide;
  const stickyTopClass = stickyPromobar
    ? 'md:top-[calc(var(--header-height-desktop)+var(--promobar-height-desktop)+2.5rem)] xl:top-[calc(var(--header-height-desktop)+var(--promobar-height-desktop)+3rem)]'
    : 'md:top-[calc(var(--header-height-desktop)+2.5rem)] xl:top-[calc(var(--header-height-desktop)+3rem)]';

  return (
    <section data-comp="product">
      <div className="md:px-contained py-6 md:py-10 lg:py-12">
        <div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-y-5 md:grid-cols-2 md:grid-rows-[auto_1fr] md:gap-y-4">
          {/* mobile header placement */}
          {/* note: remove this component if mobile header shares same placement as desktop */}
          <ProductHeader
            isMobile
            isModalProduct={isModalProduct}
            product={product}
            selectedVariant={selectedVariant}
            selectedVariantColor={selectedVariantColor}
            settings={productSettings}
          />

          <div>
            <div
              className={`md:sticky ${
                isModalProduct ? 'md:top-10 lg:top-12' : stickyTopClass
              }`}
            >
              <ProductMedia
                product={product}
                selectedVariant={selectedVariant}
                selectedVariantColor={selectedVariantColor}
              />
            </div>
          </div>

          <div className="max-md:px-4 md:pl-4 lg:pl-10 xl:pl-16">
            <div
              className={`flex flex-col gap-y-4 md:sticky ${
                isModalProduct ? 'md:top-10 lg:top-12' : stickyTopClass
              }`}
            >
              {/* desktop header placement */}
              <ProductHeader
                isModalProduct={isModalProduct}
                product={product}
                selectedVariant={selectedVariant}
                selectedVariantColor={selectedVariantColor}
                settings={productSettings}
              />

              <ProductDetails
                enabledQuantitySelector={
                  productSettings?.quantitySelector?.enabled
                }
                isModalProduct={isModalProduct}
                product={product}
                selectedVariant={selectedVariant}
              />

              <ProductMetafields product={product} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

Product.displayName = 'Product';
