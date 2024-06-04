import {useState} from 'react';
import {Navigation} from 'swiper/modules';
import type {SwiperClass} from 'swiper/react';
import {Swiper, SwiperSlide} from 'swiper/react';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

import {Link, ProductItem, Spinner, Svg} from '~/components';
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

  const [swiper, setSwiper] = useState<SwiperClass | null>(null);

  const {sliderStyle} = {...slider};
  const slidesPerViewDesktop = slider?.slidesPerViewDesktop || 4;
  const slidesPerViewTablet = slider?.slidesPerViewTablet || 3.4;
  const slidesPerViewMobile = slider?.slidesPerViewMobile || 1.4;
  const isFullBleedAndCentered =
    sliderStyle === 'fullBleed' || sliderStyle === 'fullBleedWithGradient';
  const isLoop = isFullBleedAndCentered || sliderStyle === 'containedWithLoop';
  const maxWidthClass =
    section?.fullWidth || isFullBleedAndCentered
      ? 'max-w-none'
      : 'max-w-[var(--content-max-width)]';

  return (
    <div
      className={`py-contained ${
        !isFullBleedAndCentered ? 'lg:px-contained' : ''
      }`}
    >
      <div className="m-auto flex flex-col items-center">
        <h2 className="text-h2 px-4 text-center">{heading}</h2>

        {products?.length > 0 && (
          <Swiper
            centeredSlides={
              isFullBleedAndCentered &&
              products.length >= slidesPerViewMobile * 2
            }
            className={`relative mt-10 w-full ${maxWidthClass} ${
              sliderStyle === 'fullBleedWithGradient'
                ? 'before:swiper-offset-gradient-270-left after:swiper-offset-gradient-270-right'
                : ''
            }`}
            grabCursor
            loop={isLoop && products.length >= slidesPerViewMobile * 2}
            modules={[Navigation]}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            onSwiper={setSwiper}
            slidesOffsetAfter={isFullBleedAndCentered ? 0 : 16}
            slidesOffsetBefore={isFullBleedAndCentered ? 0 : 16}
            slidesPerView={slidesPerViewMobile}
            spaceBetween={16}
            breakpoints={{
              768: {
                centeredSlides:
                  isFullBleedAndCentered &&
                  products.length >= slidesPerViewTablet * 2,
                loop: isLoop && products.length >= slidesPerViewTablet * 2,
                slidesPerView: slidesPerViewTablet,
                spaceBetween: 20,
                slidesOffsetBefore: isFullBleedAndCentered ? 0 : 32,
                slidesOffsetAfter: isFullBleedAndCentered ? 0 : 32,
              },
              1024: {
                centeredSlides:
                  isFullBleedAndCentered &&
                  products.length >= slidesPerViewDesktop * 2,
                loop: isLoop && products.length >= slidesPerViewDesktop * 2,
                slidesPerView: slidesPerViewDesktop,
                spaceBetween: 20,
                slidesOffsetBefore: 0,
                slidesOffsetAfter: 0,
              },
            }}
          >
            {swiper &&
              products.map((product, index) => {
                const hasFullProduct = !!product?.variants;
                return (
                  <SwiperSlide key={index}>
                    <ProductItem
                      enabledColorNameOnHover={
                        productItem?.enabledColorNameOnHover
                      }
                      enabledColorSelector={productItem?.enabledColorSelector}
                      enabledQuickShop={productItem?.enabledQuickShop}
                      enabledStarRating={productItem?.enabledStarRating}
                      handle={product?.handle}
                      index={index}
                      product={hasFullProduct ? product : null}
                      quickShopMobileHidden={productItem?.quickShopMobileHidden}
                      swatchesMap={swatchesMap}
                    />
                  </SwiperSlide>
                );
              })}

            {/* Navigation */}
            {products.length > slidesPerViewDesktop && (
              <div className="absolute inset-x-0 top-[calc(50%-28px)] z-[1] md:px-8 xl:px-14">
                <div
                  className={`relative mx-auto ${maxWidthClass} ${
                    isFullBleedAndCentered ? 'min-[90rem]:max-w-full' : ''
                  }`}
                >
                  <div
                    // eslint-disable-next-line tailwindcss/no-custom-classname
                    className={`swiper-button-prev left-0 top-[calc(50%-1.6875rem)] !hidden !h-14 !w-14 rounded-full border border-border bg-white after:hidden lg:!flex ${
                      !isFullBleedAndCentered ? 'xl:left-[-1.6875rem]' : ''
                    }`}
                  >
                    <Svg
                      className="max-w-5 text-black"
                      src="/svgs/arrow-left.svg#arrow-left"
                      title="Arrow Left"
                      viewBox="0 0 24 24"
                    />
                  </div>

                  <div
                    // eslint-disable-next-line tailwindcss/no-custom-classname
                    className={`swiper-button-next right-0 top-[calc(50%-1.6875rem)] !hidden !h-14 !w-14 rounded-full border border-border bg-white after:hidden lg:!flex ${
                      !isFullBleedAndCentered ? 'xl:right-[-1.6875rem]' : ''
                    }`}
                  >
                    <Svg
                      className="max-w-5 text-black"
                      src="/svgs/arrow-right.svg#arrow-right"
                      title="Arrow Right"
                      viewBox="0 0 24 24"
                    />
                  </div>
                </div>
              </div>
            )}
          </Swiper>
        )}

        {(!swiper || !products?.length) && (
          <div className="flex min-h-80 items-center justify-center">
            <Spinner width="32" />
          </div>
        )}

        {/* Footer button */}
        {button?.text && (
          <div className="mt-10">
            <Link
              aria-label={button.text}
              className={`${section?.buttonStyle || 'btn-primary'}`}
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
