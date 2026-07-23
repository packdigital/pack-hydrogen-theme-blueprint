import {useRef, useState} from 'react';
import {useLoaderData} from 'react-router';
import hexToRgba from 'hex-to-rgba';
import clsx from 'clsx';

import {Carousel} from '~/components/Carousel';
import {RichText} from '~/components/RichText';
import {Svg} from '~/components/Svg';
import {useRootLoaderData, useColorSwatches} from '~/hooks';
import type {ProductsMap} from '~/lib/types';

import {ShoppableSocialVideoProductCard} from './ShoppableSocialVideoProductCard';
import {
  Schema,
  sliderSettingsDefaults as sliderDefaults,
  textSettingsDefaults as textDefaults,
  backgroundSettingsDefaults as bgDefaults,
} from './ShoppableSocialVideo.schema';
import type {ShoppableSocialVideoCms} from './ShoppableSocialVideo.types';

export function ShoppableSocialVideo({cms}: {cms: ShoppableSocialVideoCms}) {
  const ref = useRef(null);
  const {isPreviewModeEnabled} = useRootLoaderData();
  const {productsMap} = useLoaderData<{productsMap: ProductsMap}>();
  const swatchesMap = useColorSwatches();

  const [activeIndex, setActiveIndex] = useState(0);

  const {
    video,
    products,
    product: productSettings,
    slider: sliderSettings,
    text,
    background,
  } = cms;

  const sliderProducts =
    products?.reduce((acc: Record<string, any>[], productItem) => {
      const handle = productItem?.product?.handle;
      if (!handle) return acc;
      const fullProduct = productsMap?.[handle];
      if (!fullProduct && !isPreviewModeEnabled) return acc;
      return [
        ...acc,
        {
          ...productItem,
          product: fullProduct || {handle},
        },
      ];
    }, []) || [];

  const {
    heading = textDefaults.heading,
    subtext = textDefaults.subtext,
    enabledScrollForMore = textDefaults.enabledScrollForMore,
    scrollText = textDefaults.scrollText,
    color = textDefaults.color,
  } = {...text};
  const {
    colorType = bgDefaults.colorType,
    firstColor = bgDefaults.firstColor,
    secondColor = bgDefaults.secondColor,
    thirdColor = bgDefaults.thirdColor,
  } = {...background};
  const {
    slideTextColor = sliderDefaults.slideTextColor,
    enabledScrollbar = sliderDefaults.enabledScrollbar,
    scrollbarColor = sliderDefaults.scrollbarColor,
  } = {...sliderSettings};
  const slideTextColorFaded = hexToRgba(slideTextColor, 0.6);
  const slideBorderColor = hexToRgba(slideTextColor, 0.2);

  return (
    <div
      className="shoppable-video-hero-container relative flex h-[var(--viewport-height,100vh)] justify-center overflow-hidden"
      style={{
        ...(colorType === 'solid'
          ? {backgroundColor: firstColor}
          : {
              backgroundImage:
                firstColor && secondColor && thirdColor
                  ? `linear-gradient(${colorType}, ${firstColor}, ${secondColor}, ${thirdColor})`
                  : firstColor && secondColor
                    ? `linear-gradient(${colorType}, ${firstColor}, ${secondColor})`
                    : firstColor
                      ? `linear-gradient(${colorType}, ${firstColor}, ${firstColor})`
                      : 'none',
            }),
      }}
      ref={ref}
    >
      <div className="video-ratio relative flex items-center justify-center overflow-hidden">
        {/* Video */}
        <video
          className="size-full object-cover"
          autoPlay
          loop
          muted
          controls={false}
          playsInline
          poster={video?.poster?.url}
          key={video?.video?.url}
        >
          {video?.video?.mediaType === 'VIDEO' && (
            <source src={video.video.url} type={video.video.format} />
          )}
        </video>

        <div className="absolute flex size-full flex-col justify-end shadow-[inset_0_-400px_100px_-20px_rgba(0,0,0,0.4)]">
          <div className="w-full space-y-2" style={{color}}>
            <div className="px-6">
              <h1 className="text-h3">{heading}</h1>
            </div>

            <div
              className={clsx(
                'grow space-y-2 overflow-x-hidden',
                !enabledScrollForMore && 'pb-5',
              )}
            >
              {/* Products slider */}
              <div className="relative text-clip px-6">
                <style>
                  {`.theme-product-option { border-color: ${slideBorderColor}; } .theme-product-option:first-of-type { border-top: 0; } .theme-product-option-label, .theme-product-option-label > button, .theme-product-card-text-color-faded, .theme-product-option-label .theme-selected-option-value { color: ${slideTextColorFaded}; } .theme-product-card-text-color { color: ${slideTextColor}; } .theme-product-card-text-color-faded { color: ${slideTextColorFaded}; }`}
                </style>

                <Carousel
                  ariaLabel={heading || 'Shoppable products'}
                  gap={12}
                  onSelect={setActiveIndex}
                  scrollbar={enabledScrollbar}
                  scrollbarClassName="!absolute !inset-x-0 !top-0 !mt-0 !h-1.5"
                  scrollbarColor={scrollbarColor}
                  slidesPerView={{base: 1}}
                  viewportClassName={enabledScrollbar ? 'pt-6' : undefined}
                  slides={sliderProducts.map(
                    ({product, image, badge, description}, index) => (
                      <ShoppableSocialVideoProductCard
                        product={product}
                        image={image}
                        isActive={activeIndex === index}
                        badge={badge}
                        description={description}
                        productSettings={productSettings}
                        sliderSettings={sliderSettings}
                        swatchesMap={swatchesMap}
                        key={index}
                      />
                    ),
                  )}
                />
              </div>

              {/* Subtext */}
              <RichText className="px-6">{subtext}</RichText>
            </div>

            {enabledScrollForMore && (
              <div className="flex items-center justify-center px-6 pb-4">
                <button
                  aria-label="Scroll for more"
                  className="flex items-center gap-1 p-1 text-sm"
                  onClick={() => {
                    if (!ref.current) return;
                    const container = ref.current as HTMLElement;
                    const bottomY = container.getBoundingClientRect()?.bottom;
                    window.scrollTo({
                      top: bottomY - (window.scrollY < 55 ? 55 : 0),
                      behavior: 'smooth',
                    });
                  }}
                  type="button"
                >
                  <Svg
                    className="w-5"
                    src="/svgs/chevron-down.svg#chevron-down"
                    viewBox="0 0 24 24"
                  />
                  {scrollText}
                  <Svg
                    className="w-5"
                    src="/svgs/chevron-down.svg#chevron-down"
                    viewBox="0 0 24 24"
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dark gradient for transparent header */}
      <div className="pointer-events-none absolute left-1/2 top-0 z-[1] h-[calc(100%+100px)] w-[calc(100%+400px)] -translate-x-1/2 bg-transparent shadow-[inset_0_50px_100px_50px_rgba(0,0,0,0.4)]" />
    </div>
  );
}

ShoppableSocialVideo.displayName = 'ShoppableSocialVideo';
ShoppableSocialVideo.Schema = Schema;
