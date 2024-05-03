import {useEffect, useState} from 'react';
import type {SwiperClass} from 'swiper/react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation} from 'swiper/modules';
import type {MediaEdge} from '@shopify/hydrogen/storefront-api-types';

import {ProductMediaThumbnail} from './ProductMediaThumbnail';

interface ProductMediaThumbnailsProps {
  activeIndex: number | null;
  initialIndex: number;
  media: MediaEdge['node'][];
  productTitle: string;
  setActiveIndex: (index: number) => void;
  swiper: SwiperClass;
}

export function ProductMediaThumbnails({
  activeIndex,
  initialIndex,
  media,
  productTitle,
  setActiveIndex,
  swiper,
}: ProductMediaThumbnailsProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);

  useEffect(() => {
    if (!thumbsSwiper || thumbsSwiper.destroyed) return;
    thumbsSwiper.slideTo(activeIndex || 0);
  }, [activeIndex, thumbsSwiper]);

  return (
    <>
      {/* placeholder thumbs while swiper inits */}
      {!thumbsSwiper && (
        <div className="absolute left-0 top-0 z-[2] grid w-full grid-cols-6 gap-2 lg:grid-cols-1 lg:gap-3">
          {media
            .slice(initialIndex, initialIndex + 6)
            .map((mediaItem, index) => {
              const {id, mediaContentType} = mediaItem;
              const isActive = index === activeIndex;
              const image = mediaItem.previewImage;
              return (
                <ProductMediaThumbnail
                  alt={productTitle}
                  image={image}
                  index={index}
                  isActive={isActive}
                  key={id}
                  mediaContentType={mediaContentType}
                />
              );
            })}
        </div>
      )}

      <Swiper
        modules={[Navigation]}
        className="max-lg:absolute max-lg:left-0 max-lg:top-0 max-lg:w-full lg:h-full"
        grabCursor
        initialSlide={initialIndex}
        onSwiper={setThumbsSwiper}
        preventClicks={false}
        preventClicksPropagation={false}
        slidesPerView={6}
        spaceBetween={8}
        onSlideChange={(_swiper) => {
          if (!swiper) return;
          setActiveIndex(_swiper.realIndex);
          swiper.slideTo(_swiper.realIndex);
        }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        breakpoints={{
          1024: {
            direction: 'vertical',
            slidesPerView: 5,
            spaceBetween: 12,
          },
          1280: {
            direction: 'vertical',
            slidesPerView: 6,
            spaceBetween: 12,
          },
        }}
      >
        {!!thumbsSwiper &&
          media.map((mediaItem, index) => {
            const {id, mediaContentType} = mediaItem;
            const isActive = index === activeIndex;
            const image = mediaItem.previewImage;
            return (
              <SwiperSlide key={id}>
                <ProductMediaThumbnail
                  alt={productTitle}
                  image={image}
                  index={index}
                  isActive={isActive}
                  mediaContentType={mediaContentType}
                  swiper={swiper}
                />
              </SwiperSlide>
            );
          })}

        <div
          // eslint-disable-next-line tailwindcss/no-custom-classname
          className="swiper-button-prev !left-0 !text-black opacity-90 after:flex after:size-5 after:items-center after:justify-center after:overflow-hidden after:rounded-[50%] after:bg-white after:!text-[0.6rem] after:!content-['prev'] lg:!left-1/2 lg:!top-5 lg:!-translate-x-1/2 lg:!rotate-90"
        />

        <div
          // eslint-disable-next-line tailwindcss/no-custom-classname
          className="swiper-button-next !right-0 !text-black opacity-90 after:flex after:size-5 after:items-center after:justify-center after:overflow-hidden after:rounded-[50%] after:bg-white after:!text-[0.6rem] after:!content-['next'] lg:!bottom-0 lg:!left-1/2 lg:!top-auto lg:!-translate-x-1/2 lg:!rotate-90"
        />
      </Swiper>
    </>
  );
}

ProductMediaThumbnails.displayName = 'ProductMediaThumbnails';
