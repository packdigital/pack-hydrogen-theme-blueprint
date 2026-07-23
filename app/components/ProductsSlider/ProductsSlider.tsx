import clsx from 'clsx';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

import {Carousel} from '~/components/Carousel';
import {Link} from '~/components/Link';
import {ProductItem} from '~/components/ProductItem';
import {useColorSwatches} from '~/hooks';

import type {ProductsSliderCms} from './ProductsSlider.types';

export function ProductsSlider({
  cms,
  products,
}: {
  cms: ProductsSliderCms;
  products: Product[];
}) {
  const {button, heading, productItem, section, slider} = cms;
  const swatchesMap = useColorSwatches();

  const {sliderStyle} = {...slider};
  const isFullBleedAndCentered =
    sliderStyle === 'fullBleed' || sliderStyle === 'fullBleedWithGradient';
  const isLoop = isFullBleedAndCentered || sliderStyle === 'containedWithLoop';
  const maxWidthClass =
    section?.fullWidth || isFullBleedAndCentered
      ? 'max-w-none'
      : 'max-w-[var(--content-max-width)]';

  const slidesPerViewDesktop = slider?.slidesPerViewDesktop || 4;
  const productsLoaded = products?.length > 0;
  // Expected slide count from the CMS config — available at SSR, before the
  // async products fetch resolves — so the carousel renders a skeleton
  // immediately instead of the whole slider popping in once products load.
  // Count only linked products (those with an id), matching what the section
  // actually fetches, so unlinked entries don't leave a perpetual skeleton.
  const expectedCount =
    cms.products?.filter(({product}) => product?.id).length || 0;
  const slideCount = productsLoaded ? products.length : expectedCount;
  const enableLoop = isLoop && slideCount >= slidesPerViewDesktop * 2;

  return (
    <div
      className={clsx(
        'py-contained',
        !isFullBleedAndCentered && 'lg:px-contained',
      )}
    >
      <div className="m-auto flex flex-col items-center">
        <h2 className="text-h2 px-4 text-center">{heading}</h2>

        {slideCount > 0 && (
          <Carousel
            ariaLabel={heading || 'Products'}
            arrows={slideCount > slidesPerViewDesktop}
            className={clsx(
              'mt-10 w-full',
              maxWidthClass,
              sliderStyle === 'fullBleedWithGradient' &&
                'slider-offset-gradient-270-left slider-offset-gradient-270-right',
            )}
            gap={{base: 16, md: 20}}
            options={{
              loop: enableLoop,
              align: isFullBleedAndCentered ? 'center' : 'start',
            }}
            slides={(productsLoaded
              ? products
              : Array.from({length: expectedCount}, () => null)
            ).map((product, index) => {
              // Render ProductItem in every state (loading included): with a
              // null product it shows its own skeleton (via ProductItemMedia),
              // then the SAME instance fills in when the product loads.
              // Swapping in a separate skeleton component would unmount/remount
              // the slide.
              const hasFullProduct = !!product?.variants;
              return (
                <ProductItem
                  enabledColorNameOnHover={productItem?.enabledColorNameOnHover}
                  enabledColorSelector={productItem?.enabledColorSelector}
                  enabledQuickShop={productItem?.enabledQuickShop}
                  enabledStarRating={productItem?.enabledStarRating}
                  handle={product?.handle}
                  index={index}
                  key={index}
                  product={hasFullProduct ? product : null}
                  quickShopMobileHidden={productItem?.quickShopMobileHidden}
                  swatchesMap={swatchesMap}
                />
              );
            })}
            slidesPerView={{
              base: slider?.slidesPerViewMobile || 2.4,
              md: slider?.slidesPerViewTablet || 3.4,
              lg: slidesPerViewDesktop,
            }}
            viewportClassName={clsx(
              !isFullBleedAndCentered && 'max-md:px-4 md:max-lg:px-8',
            )}
          />
        )}

        {/* Footer button */}
        {button?.text && (
          <div className="mt-10">
            <Link
              aria-label={button.text}
              className={clsx(section?.buttonStyle || 'btn-primary')}
              to={button.url}
              newTab={button.newTab}
              type={button.type}
            >
              {button.text}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

ProductsSlider.displayName = 'ProductsSlider';
