import {useEffect, useMemo} from 'react';
import {useSiteSettings} from '@pack/react';
import {useProduct} from '@shopify/hydrogen-react';
import type {Product as ProductType} from '@shopify/hydrogen/storefront-api-types';

import {COLOR_OPTION_NAME} from '~/lib/constants';
import type {SelectedVariant, SiteSettings} from '~/lib/types';
import {useDataLayerViewProduct, useLocale} from '~/hooks';

import {ProductDetails} from './ProductDetails';
import {ProductMetafields} from './ProductMetafields';
import {ProductHeader} from './ProductHeader';
import {ProductMedia} from './ProductMedia';

interface ProductProps {
  product: ProductType;
}

export function Product({product}: ProductProps) {
  const {selectedVariant} = useProduct() as {
    selectedVariant: SelectedVariant;
  };
  const {pathPrefix} = useLocale();
  const siteSettings = useSiteSettings() as SiteSettings;
  const settings = siteSettings?.settings?.product;

  useDataLayerViewProduct({
    product,
    selectedVariant,
  });

  const selectedVariantColor = useMemo(() => {
    return selectedVariant?.selectedOptions?.find(
      ({name}) => name === COLOR_OPTION_NAME,
    )?.value;
  }, [selectedVariant]);

  // set variant url param on selected variant change unless has one variant
  useEffect(() => {
    if (product.variants.nodes.length === 1 || !selectedVariant) return;

    const {origin, search} = window.location;

    const params = new URLSearchParams(search);
    selectedVariant.selectedOptions?.forEach(({name, value}) => {
      params.set(name, value);
    });

    const updatedUrl = `${origin}${pathPrefix}/products/${product.handle}?${params}`;

    window.history.replaceState(window.history.state, '', updatedUrl);
  }, [product.handle, selectedVariant?.id]);

  const stickyPromobar =
    siteSettings?.settings?.header?.promobar?.enabled &&
    !siteSettings?.settings?.header?.promobar?.autohide;
  const stickyTopClass = stickyPromobar
    ? 'md:top-[calc(var(--header-height)+var(--promobar-height)+2.5rem)] xl:top-[calc(var(--header-height)+var(--promobar-height)+3rem)]'
    : 'md:top-[calc(var(--header-height)+2.5rem)] xl:top-[calc(var(--header-height)+3rem)]';

  return (
    <section data-comp="product">
      <div className="md:px-contained py-6 md:py-10 lg:py-12">
        <div className="mx-auto grid max-w-[80rem] grid-cols-1 gap-y-5 md:grid-cols-2 md:grid-rows-[auto_1fr] md:gap-y-4">
          {/* mobile header placement */}
          {/* note: remove this component if mobile header shares same placement as desktop */}
          <ProductHeader
            isMobile
            product={product}
            selectedVariant={selectedVariant}
            selectedVariantColor={selectedVariantColor}
            settings={settings}
          />

          <div>
            <div className={`md:sticky ${stickyTopClass}`}>
              <ProductMedia
                product={product}
                selectedVariant={selectedVariant}
                selectedVariantColor={selectedVariantColor}
              />
            </div>
          </div>

          <div className="max-md:px-4 md:pl-4 lg:pl-10 xl:pl-16">
            <div
              className={`flex flex-col gap-y-4 md:sticky ${stickyTopClass}`}
            >
              {/* desktop header placement */}
              <ProductHeader
                product={product}
                selectedVariant={selectedVariant}
                selectedVariantColor={selectedVariantColor}
                settings={settings}
              />

              <ProductDetails
                enabledQuantitySelector={settings?.quantitySelector?.enabled}
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
