import {forwardRef, useEffect, useState} from 'react';
import clsx from 'clsx';

import {ProductAddToCart} from './ProductAddToCart';
import type {ProductStickyAddToCartProps} from './Product.types';

export const ProductStickyAddToCart = forwardRef(
  (
    {
      enabledQuantitySelector,
      quantity,
      selectedVariant,
      setQuantity,
      viewports = 'mobile',
    }: ProductStickyAddToCartProps,
    addToCartRef: React.Ref<HTMLDivElement> | null,
  ) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
      const scrollHandler = () => {
        const addToCartPosition =
          addToCartRef?.current?.getBoundingClientRect().top || 0;
        const addToCartHeight = addToCartRef?.current?.clientHeight || 0;
        const shouldShowStickyCTA = addToCartPosition + addToCartHeight < 0;

        if (!show && shouldShowStickyCTA) setShow(true);
        else if (show && !shouldShowStickyCTA) setShow(false);
      };
      window.addEventListener('scroll', scrollHandler);
      return () => {
        window.removeEventListener('scroll', scrollHandler);
      };
    }, [show]);

    return (
      <div
        className={clsx(
          'fixed inset-x-0 top-full z-20 flex w-full items-center gap-2 bg-background p-3 shadow-[0_3px_30px_rgba(0,0,0,0.08)] transition-transform duration-300 will-change-transform',
          show ? '-translate-y-full' : 'translate-y-0',
          viewports === 'mobile-tablet-desktop'
            ? ''
            : viewports === 'mobile-tablet'
              ? 'lg:hidden'
              : 'md:hidden',
        )}
      >
        <ProductAddToCart
          enabledQuantitySelector={enabledQuantitySelector}
          quantity={quantity}
          selectedVariant={selectedVariant}
          setQuantity={setQuantity}
        />
      </div>
    );
  },
);

ProductStickyAddToCart.displayName = 'ProductStickyAddToCart';
