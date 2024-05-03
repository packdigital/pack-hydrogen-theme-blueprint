import {useEffect, useState} from 'react';
import type {SwiperClass} from 'swiper/react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {A11y, Pagination} from 'swiper/modules';
import type {Image} from '@shopify/hydrogen/storefront-api-types';

import {Badges} from '~/components';
import type {ProductWithGrouping, SelectedVariant} from '~/lib/types';

import {ProductImage} from './ProductImage';
import {ProductMediaFile} from './ProductMediaFile';
import {ProductMediaThumbnails} from './ProductMediaThumbnails';
import {useProductMedia} from './useProductMedia';

interface ProductMediaProps {
  product: ProductWithGrouping;
  selectedVariant: SelectedVariant;
  selectedVariantColor: string | null | undefined;
}

export function ProductMedia({
  product,
  selectedVariant,
  selectedVariantColor,
}: ProductMediaProps) {
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);

  const {initialIndex, maybeHasImagesByVariant, media} = useProductMedia({
    product,
    selectedVariant,
  });

  const [activeIndex, setActiveIndex] = useState<number>(initialIndex);

  // Reset the active index when the selected color changes
  useEffect(() => {
    if (!swiper || swiper.destroyed) return;
    if (maybeHasImagesByVariant) {
      const mediaIndex = product.media.nodes.findIndex(
        ({previewImage}) => previewImage?.url === selectedVariant?.image?.url,
      );
      const index = mediaIndex >= 0 ? mediaIndex : 0;
      swiper.slideTo(index);
      setActiveIndex(index);
      return;
    }
    setActiveIndex(0);
    swiper.slideTo(0);
  }, [maybeHasImagesByVariant, selectedVariantColor, swiper]);

  const firstMediaImageOnMount = media[initialIndex]?.previewImage as
    | Image
    | undefined;

  return (
    <div className="grid grid-cols-1 justify-between gap-4 lg:grid-cols-[80px_calc(100%-100px)] xl:gap-5">
      <div className="order-1 lg:order-2">
        <div
          className="relative md:bg-offWhite"
          // for a static/consistent aspect ratio, delete style below and add 'aspect-[var(--product-image-aspect-ratio)]' to className
          // set var(--product-image-aspect-ratio) in styles/app.css
          style={{
            aspectRatio:
              firstMediaImageOnMount?.width && firstMediaImageOnMount?.height
                ? firstMediaImageOnMount.width / firstMediaImageOnMount.height
                : 'var(--product-image-aspect-ratio)',
          }}
        >
          <Swiper
            onSwiper={setSwiper}
            modules={[A11y, Pagination]}
            onSlideChange={(_swiper) => {
              setActiveIndex(_swiper.realIndex);
            }}
            slidesPerView={1}
            grabCursor
            initialSlide={initialIndex}
            pagination={{
              el: '.swiper-pagination',
              clickable: true,
            }}
            className="max-md:!pb-5 md:pb-0"
          >
            {media.map((media, index) => {
              return (
                <SwiperSlide key={media.id}>
                  <ProductMediaFile
                    alt={product.title}
                    media={media}
                    priority={index === initialIndex}
                  />
                </SwiperSlide>
              );
            })}

            <div
              // eslint-disable-next-line tailwindcss/no-custom-classname
              className="active-bullet-black swiper-pagination !top-[calc(100%-8px)] flex w-full justify-center gap-2.5 md:hidden"
            />
          </Swiper>

          {/* placeholder image while swiper inits */}
          {!swiper && (
            <div className="absolute inset-0 z-[1] size-full max-md:hidden">
              <ProductImage
                alt={product.title}
                image={firstMediaImageOnMount}
                priority
              />
            </div>
          )}

          <div className="pointer-events-none absolute left-0 top-0 z-[1] p-2.5 xs:p-4 md:p-3 xl:p-4">
            <Badges tags={product.tags} />
          </div>
        </div>
      </div>

      {/*
       * Height classes breakdown for a vertical stack. For horizontal stack, use inverse logic with width instead
       * Example: "h-[calc(90px*4+10px*3)]" (with w-[90px])
       * 90px = height of each thumbnail. In this case, this implies a square aspect ratio because it's the same as the width. For anything else, update px height accordingly in relation to its width
       * 4 = number of thumbnails
       * 10px = gutter between thumbnails
       * 3 = number of gutters between thumbnails
       */}
      <div className="scrollbar-hide relative order-2 hidden w-full overflow-x-auto md:block md:max-lg:pb-[calc((100%-5*8px)/6)] lg:order-1 lg:h-[calc(80px*5+12px*4)] xl:h-[calc(80px*6+12px*5)]">
        {media.length > 0 && (
          <ProductMediaThumbnails
            activeIndex={activeIndex}
            initialIndex={initialIndex}
            media={media}
            productTitle={product.title}
            setActiveIndex={setActiveIndex}
            swiper={swiper}
          />
        )}
      </div>
    </div>
  );
}

ProductMedia.displayName = 'ProductMedia';
