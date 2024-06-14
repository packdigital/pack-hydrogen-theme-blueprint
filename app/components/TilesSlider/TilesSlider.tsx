import {useState, forwardRef} from 'react';
import type {LegacyRef} from 'react';
import type {SwiperClass} from 'swiper/react';
import {Swiper, SwiperSlide} from 'swiper/react';

import {Spinner} from '~/components';

import {TilesSliderTile} from './TilesSliderTile';

interface TilesSliderProps {
  aspectRatio: string;
  maxWidthClass: string;
  textColor: string;
  textAlign?: string;
  tileHeadingSize?: string;
  tiles: {
    image: {
      src: string;
    };
    title: string;
    url: string;
  }[];
  tilesPerViewDesktop: number;
  tilesPerViewTablet: number;
  tilesPerViewMobile: number;
}

export const TilesSlider = forwardRef(
  (
    {
      aspectRatio,
      maxWidthClass,
      textAlign,
      textColor,
      tiles,
      tileHeadingSize,
      tilesPerViewDesktop = 3,
      tilesPerViewTablet = 2.4,
      tilesPerViewMobile = 1.4,
    }: TilesSliderProps,
    ref: LegacyRef<HTMLDivElement> | undefined,
  ) => {
    const [swiper, setSwiper] = useState<SwiperClass | null>(null);

    const isGridOnDesktop = tiles?.length === tilesPerViewDesktop;

    return tiles?.length > 0 ? (
      <div className={`mx-auto ${maxWidthClass}`} ref={ref}>
        {/* mobile/tablet/desktop */}
        <div
          className={`relative [&_.swiper]:overflow-visible ${
            isGridOnDesktop ? 'lg:hidden' : ''
          }`}
        >
          <Swiper
            grabCursor
            onSwiper={setSwiper}
            slidesOffsetAfter={16}
            slidesOffsetBefore={16}
            slidesPerView={tilesPerViewMobile}
            spaceBetween={16}
            breakpoints={{
              768: {
                slidesPerView: tilesPerViewTablet,
                slidesOffsetBefore: 32,
                slidesOffsetAfter: 32,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: tilesPerViewDesktop,
                slidesOffsetBefore: 0,
                slidesOffsetAfter: 0,
                spaceBetween: 20,
              },
            }}
          >
            {swiper &&
              tiles.map((item, index) => {
                return (
                  <SwiperSlide className="w-full" key={index}>
                    <TilesSliderTile
                      aspectRatio={aspectRatio}
                      item={item}
                      textAlign={textAlign}
                      textColor={textColor}
                      tileHeadingSize={tileHeadingSize}
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
        {isGridOnDesktop && (
          <div
            className="hidden gap-x-5 lg:grid"
            style={{gridTemplateColumns: `repeat(${tilesPerViewDesktop}, 1fr)`}}
          >
            {tiles.map((item, blockIndex) => {
              return (
                <div key={blockIndex}>
                  <TilesSliderTile
                    aspectRatio={aspectRatio}
                    item={item}
                    textAlign={textAlign}
                    textColor={textColor}
                    tileHeadingSize={tileHeadingSize}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    ) : null;
  },
);

TilesSlider.displayName = 'TilesSlider';
