import {useState, forwardRef} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import clsx from 'clsx';
import type {SwiperClass} from 'swiper/react';

import {SwiperSkeleton} from '~/components/SwiperSkeleton';
import type {MediaCms} from '~/lib/types';

import {TilesSliderTile} from './TilesSliderTile';

interface TilesSliderProps {
  aspectRatio: string;
  maxWidthClass: string;
  textColor: string;
  textAlign?: string;
  tileHeadingSize?: string;
  tiles: {
    image: MediaCms;
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
    ref: React.Ref<HTMLDivElement> | undefined,
  ) => {
    const [swiper, setSwiper] = useState<SwiperClass | null>(null);

    const breakpoints = {
      mobile: {
        slidesPerView: tilesPerViewMobile,
        slidesOffsetBefore: 16,
        slidesOffsetAfter: 16,
        spaceBetween: 16,
      },
      tablet: {
        slidesPerView: tilesPerViewTablet,
        slidesOffsetBefore: 32,
        slidesOffsetAfter: 32,
        spaceBetween: 20,
      },
      desktop: {
        slidesPerView: tilesPerViewDesktop,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
        spaceBetween: 20,
      },
    };

    const isGridOnDesktop = tiles?.length === tilesPerViewDesktop;

    return tiles?.length > 0 ? (
      <div className={clsx('mx-auto', maxWidthClass)} ref={ref}>
        {/* mobile/tablet/desktop */}
        <div
          className={clsx(
            'relative [&_.swiper]:overflow-visible',
            isGridOnDesktop && 'lg:hidden',
          )}
        >
          <Swiper
            grabCursor
            onSwiper={setSwiper}
            slidesOffsetAfter={breakpoints.mobile.slidesOffsetAfter}
            slidesOffsetBefore={breakpoints.mobile.slidesOffsetBefore}
            slidesPerView={breakpoints.mobile.slidesPerView}
            spaceBetween={breakpoints.mobile.spaceBetween}
            breakpoints={{
              768: breakpoints.tablet,
              1024: breakpoints.desktop,
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
            <SwiperSkeleton breakpoints={breakpoints}>
              <div className="animate-pulse">
                <div className={clsx('bg-neutralLightest', aspectRatio)} />
                <div className="mt-4 w-[150px] h-[29px] md:h-8 bg-neutralLightest" />
              </div>
            </SwiperSkeleton>
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
