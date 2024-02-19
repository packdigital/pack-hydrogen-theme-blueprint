import {useState, forwardRef} from 'react';
import type {LegacyRef} from 'react';
import type {SwiperClass} from 'swiper/react';
import {Swiper, SwiperSlide} from 'swiper/react';

import {Spinner} from '~/components';

import {ThreeTilesTile} from './ThreeTilesTile';

interface ThreeTilesRowProps {
  aspectRatio: string;
  maxWidthClass: string;
  textColor: string;
  tiles: {
    image: {
      src: string;
    };
    title: string;
    url: string;
  }[];
}

export const ThreeTilesRow = forwardRef(
  (
    {aspectRatio, maxWidthClass, textColor, tiles}: ThreeTilesRowProps,
    ref: LegacyRef<HTMLDivElement> | undefined,
  ) => {
    const [swiper, setSwiper] = useState<SwiperClass | null>(null);

    return tiles?.length > 0 ? (
      <div className={`mx-auto ${maxWidthClass}`} ref={ref}>
        {/* mobile/tablet */}
        <div className="relative lg:hidden">
          <Swiper
            grabCursor
            onSwiper={setSwiper}
            slidesOffsetAfter={16}
            slidesOffsetBefore={16}
            slidesPerView={1.4}
            spaceBetween={16}
            breakpoints={{
              768: {
                slidesPerView: 2.4,
                slidesOffsetBefore: 32,
                slidesOffsetAfter: 32,
                spaceBetween: 20,
              },
            }}
          >
            {swiper &&
              tiles.slice(0, 3).map((item, index) => {
                return (
                  <SwiperSlide className="w-full" key={index}>
                    <ThreeTilesTile
                      aspectRatio={aspectRatio}
                      item={item}
                      textColor={textColor}
                    />
                  </SwiperSlide>
                );
              })}
          </Swiper>

          {!swiper && (
            <div className="flex min-h-[25rem] items-center justify-center">
              <Spinner width="32" />
            </div>
          )}
        </div>

        {/* desktop */}
        <div className="hidden grid-cols-3 gap-x-5 lg:grid">
          {tiles.slice(0, 3).map((item, blockIndex) => {
            return (
              <div key={blockIndex}>
                <ThreeTilesTile
                  aspectRatio={aspectRatio}
                  item={item}
                  textColor={textColor}
                />
              </div>
            );
          })}
        </div>
      </div>
    ) : null;
  },
);

ThreeTilesRow.displayName = 'ThreeTilesRow';
