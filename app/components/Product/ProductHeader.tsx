import {useCallback} from 'react';
import clsx from 'clsx';

import {ProductStars} from '~/components/ProductStars';
import {useMatchMedia, useVariantPrices} from '~/hooks';
import {HEADER_NAVIGATION, PRODUCT_MODAL_PANEL} from '~/lib/constants';
import {PRODUCT_REVIEWS_KEY} from '~/sections/ProductReviews';

import type {ProductHeaderProps} from './Product.types';

export function ProductHeader({
  isMobile,
  isModalProduct,
  product,
  selectedVariant,
  selectedVariantColor,
  settings,
}: ProductHeaderProps) {
  const {price, compareAtPrice} = useVariantPrices(selectedVariant);
  const {enabledStarRating = true} = {...settings?.reviews};
  const isMobileViewport = useMatchMedia('(max-width: 767px)');

  const handleScrollToReviews = useCallback(() => {
    if (isModalProduct) {
      const productModal = document.getElementById(PRODUCT_MODAL_PANEL);
      const reviewsSection = productModal?.querySelector(
        `[data-comp="${PRODUCT_REVIEWS_KEY}"]`,
      );
      reviewsSection?.scrollIntoView({behavior: 'smooth'});
      return;
    }

    const reviewsSection = document.querySelector(
      `[data-comp="${PRODUCT_REVIEWS_KEY}"]`,
    );
    if (!reviewsSection) return;

    const header = document.querySelector(`[data-comp="${HEADER_NAVIGATION}"]`);
    const headerHeight = header ? (header as HTMLElement).offsetHeight : 80;

    const offsetTop = reviewsSection.getBoundingClientRect().top - headerHeight;
    window.scrollTo({top: offsetTop, behavior: 'smooth'});
  }, [isModalProduct]);

  const isVisibleHeader =
    (isMobile && isMobileViewport) || (!isMobile && !isMobileViewport);

  return (
    <div
      className={clsx(
        'max-md:px-4',
        // remove if only one header placement is used
        isMobile ? 'md:hidden' : 'max-md:hidden',
      )}
    >
      {enabledStarRating && (
        <div className="min-h-6">
          <button
            aria-label="Scroll to product reviews"
            onClick={handleScrollToReviews}
            type="button"
          >
            <ProductStars id={product.id} />
          </button>
        </div>
      )}

      {/* ensure only one H1 is in the DOM at a time */}
      {/* remove ternary and only use <h1> if only one header placement is used */}
      {isVisibleHeader ? (
        <h1 className="text-h2">{product.title}</h1>
      ) : (
        <h2 className="text-h2">{product.title}</h2>
      )}

      {selectedVariantColor && (
        <h2 className="min-h-6 text-base font-normal">
          {selectedVariantColor}
        </h2>
      )}

      <div className="mt-2 flex min-h-6 gap-2">
        {compareAtPrice && (
          <p className="text-neutralMedium line-through">{compareAtPrice}</p>
        )}
        <p>{price}</p>
      </div>
    </div>
  );
}

ProductHeader.displayName = 'ProductHeader';
