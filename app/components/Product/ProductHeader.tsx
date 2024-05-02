import type {Product} from '@shopify/hydrogen/storefront-api-types';

import {ProductStars} from '~/components';
import type {SelectedVariant, Settings} from '~/lib/types';
import {useMatchMedia, useVariantPrices} from '~/hooks';

interface ProductHeaderProps {
  isMobile?: boolean;
  product: Product;
  selectedVariant: SelectedVariant;
  selectedVariantColor: string | null | undefined;
  settings: Settings['product'];
}

export function ProductHeader({
  isMobile,
  product,
  selectedVariant,
  selectedVariantColor,
  settings,
}: ProductHeaderProps) {
  const {price, compareAtPrice} = useVariantPrices(selectedVariant);
  const {enabledStarRating = true} = {...settings?.reviews};
  const isMobileViewport = useMatchMedia('(max-width: 767px)');
  const isVisibleHeader =
    (isMobile && isMobileViewport) || (!isMobile && !isMobileViewport);

  return (
    <div
      className={`max-md:px-4 ${
        // remove if only one header placement is used
        isMobile ? 'md:hidden' : 'max-md:hidden'
      }`}
    >
      {enabledStarRating && (
        <div className="min-h-6">
          <button
            aria-label="Scroll to product reviews"
            onClick={() => {
              // scroll to reviews
            }}
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
          <p className="text-mediumDarkGray line-through">{compareAtPrice}</p>
        )}
        <p>{price}</p>
      </div>
    </div>
  );
}

ProductHeader.displayName = 'ProductHeader';
