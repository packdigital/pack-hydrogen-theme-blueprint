import {useEffect, useState} from 'react';
import {Navigation} from 'swiper/modules';
import type {SwiperClass} from 'swiper/react';
import {Swiper, SwiperSlide} from 'swiper/react';

import {ProductMediaThumbnail} from './ProductMediaThumbnail';

import type {ProductMediaThumbnailsProps} from '~/components/Product/ProductMedia/ProductMedia.types';

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
        className="max-lg:!absolute max-lg:left-0 max-lg:top-0 max-lg:w-full lg:h-full"
        grabCursor
        initialSlide={initialIndex}
        onSwiper={setThumbsSwiper}
        preventClicks={false}
        preventClicksPropagation={false}
        centeredSlides={true}
        centeredSlidesBounds={true}
        effect="fade"
        fadeEffect={{crossFade: true}}
        slidesPerView={6}
        spaceBetween={8}
        onSlideChange={(_swiper) => {
          if (!swiper) return;
          setActiveIndex(_swiper.realIndex);
        }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        breakpoints={{
          1024: {
            slidesPerView: 5,
            spaceBetween: 12,
          },
          1280: {
            slidesPerView: 6,
            spaceBetween: 12,
          },
        }}
      >
        {!!thumbsSwiper &&
          swiper &&
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

        <div className="swiper-button-prev  rounded-full  bg-white p-4 opacity-95  [--swiper-navigation-color:bg-primary] [--swiper-navigation-size:16px]" />
        <div className="swiper-button-next  rounded-full  bg-white p-4 opacity-95  [--swiper-navigation-color:bg-primary] [--swiper-navigation-size:16px]" />
      </Swiper>
    </>
  );
}

ProductMediaThumbnails.displayName = 'ProductMediaThumbnails';
