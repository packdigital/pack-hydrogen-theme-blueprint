import {useCallback, useEffect, useMemo, useState} from 'react';
import {useProduct} from '@shopify/hydrogen-react';
import type {Product as ProductType} from '@shopify/hydrogen/storefront-api-types';

import {AddToCart} from '~/components/AddToCart';
import {Link} from '~/components/Link';
import {QuantitySelector} from '~/components/QuantitySelector';
import {Svg} from '~/components/Svg';
import {useMenu, useSettings, useVariantPrices} from '~/hooks';
import {ProductReviews} from '~/sections/ProductReviews';
import {MODAL_PRODUCT_URL_PARAM, PRODUCT_MODAL_PANEL} from '~/lib/constants';
import type {SelectedVariant} from '~/lib/types';

import {Product} from '../Product';

interface ProductModalPanelProps {
  closeProductModal: () => void;
  closeProductUrl: string;
  product: ProductType;
}

export function ProductModalPanel({
  closeProductModal,
  closeProductUrl,
  product,
}: ProductModalPanelProps) {
  const {product: productSettings} = useSettings();
  const {closeAll} = useMenu();
  const {selectedVariant} = useProduct() as {
    selectedVariant: SelectedVariant;
  };
  const {price} = useVariantPrices(selectedVariant);

  const {
    increment = 1,
    minimum = 1,
    maximum,
  } = {...selectedVariant?.quantityRule};

  const [quantity, setQuantity] = useState(minimum);

  const {disableDecrement, disableIncrement} = useMemo(() => {
    const nextIncrement = increment - (quantity % increment);
    const prevIncrement =
      quantity % increment === 0 ? increment : quantity % increment;
    const prevQuantity = Number(
      Math.max(0, quantity - prevIncrement).toFixed(0),
    );
    const nextQuantity = Number((quantity + nextIncrement).toFixed(0));
    return {
      disableDecrement: prevQuantity < minimum,
      disableIncrement: Boolean(maximum && nextQuantity > maximum),
    };
  }, [increment, minimum, maximum, quantity, selectedVariant?.id]);

  const enabledQuantitySelector =
    productSettings?.quantitySelector?.enabled || false;

  const handleDecrement = useCallback(() => {
    if (disableDecrement) return;
    setQuantity(quantity - increment);
  }, [quantity, increment, disableDecrement]);

  const handleIncrement = useCallback(() => {
    if (disableIncrement) return;
    setQuantity(quantity + increment);
  }, [quantity, increment, disableIncrement]);

  useEffect(() => {
    if (!enabledQuantitySelector) return undefined;
    return () => {
      setQuantity(minimum);
    };
  }, [enabledQuantitySelector]);

  /* set variant url param on selected variant change unless has one variant */
  useEffect(() => {
    if (!product || product.variants?.nodes?.length === 1 || !selectedVariant)
      return;

    const {origin, pathname, search} = window.location;

    const params = new URLSearchParams(search);
    const productParam = params.get(MODAL_PRODUCT_URL_PARAM);
    const variantParams = new URLSearchParams(productParam?.split('?')[1]);
    selectedVariant.selectedOptions?.forEach(({name, value}) => {
      variantParams.set(name, value);
    });
    params.set(
      MODAL_PRODUCT_URL_PARAM,
      `${product.handle}${`?${variantParams}`}`,
    );

    const updatedUrl = `${origin}${pathname}?${params}`;

    window.history.replaceState(window.history.state, '', updatedUrl);
  }, [product?.handle, selectedVariant?.id]);

  /* ensure close modal and cart on mount */
  useEffect(() => {
    closeAll();
  }, []);

  return (
    <section
      data-comp="product"
      className="flex h-full max-h-[calc(var(--viewport-height,100vh)-1rem)] flex-col justify-between"
    >
      <div className="flex justify-end border-b border-border">
        <Link
          aria-label="Close modal"
          className="flex items-center gap-1 p-4"
          onClick={closeProductModal}
          to={closeProductUrl}
        >
          <span>Close</span>
          <Svg
            className="w-4"
            src="/svgs/close.svg#close"
            title="Close"
            viewBox="0 0 24 24"
          />
        </Link>
      </div>

      <div
        className="scrollbar-hide relative flex-1 overflow-y-auto"
        id={PRODUCT_MODAL_PANEL}
      >
        <div className="md:px-contained py-6 md:py-10 lg:py-12">
          <Product isModalProduct product={product} />
        </div>

        <ProductReviews cms={{container: {bgColor: 'var(--background)'}}} />
      </div>

      <div className="flex items-center gap-3 border-t border-border p-4">
        {enabledQuantitySelector && (
          <QuantitySelector
            disableDecrement={disableDecrement}
            disableIncrement={disableIncrement}
            handleDecrement={handleDecrement}
            handleIncrement={handleIncrement}
            productTitle={product.title}
            quantity={quantity}
          />
        )}

        <AddToCart
          containerClassName="flex-1"
          isPdp
          onAddToCart={closeProductModal}
          price={price}
          quantity={quantity}
          selectedVariant={selectedVariant}
        />
      </div>
    </section>
  );
}

ProductModalPanel.displayName = 'ProductModalPanel';
