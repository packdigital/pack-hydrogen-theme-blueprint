import {useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import clsx from 'clsx';
import type {SwiperClass} from 'swiper/react';

import {Container} from '~/components/Container';
import {SwiperSkeleton} from '~/components/SwiperSkeleton';

import type {ImageTilesCms} from './ImageTiles.types';
import {ImageTile} from './ImageTile';
import {Schema} from './ImageTiles.schema';

export function ImageTiles({cms}: {cms: ImageTilesCms}) {
  const {content, header, section, tiles} = cms;
  const {
    heading,
    subheading,
    alignment = 'text-center items-center',
  } = {...header};
  const {
    tilesPerViewDesktop = 3,
    tilesPerViewTablet = 2.4,
    tilesPerViewMobile = 1.4,
    aspectRatio = 'aspect-[3/4]',
    textColor = 'var(--text)',
    fullWidth,
  } = {...section};

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

  const maxWidthClass = fullWidth
    ? 'max-w-none'
    : 'max-w-[var(--content-max-width)]';
  const isGridOnDesktop = tiles?.length === tilesPerViewDesktop;

  return (
    <Container container={cms.container}>
      <div className="lg:px-contained overflow-x-clip py-4 md:py-6">
        {(!!heading || !!subheading) && (
          <div
            className={clsx(
              'max-lg:px-contained mx-auto mb-6 flex w-full flex-col gap-2',
              alignment,
              maxWidthClass,
            )}
            style={{color: textColor}}
          >
            {heading && <h2 className="text-h2">{heading}</h2>}
            {subheading && <span className="text-body-lg">{subheading}</span>}
          </div>
        )}

        <div className={clsx('mx-auto', maxWidthClass)}>
          {tiles?.length > 0 && (
            <>
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
                    tiles.map((tile, index) => {
                      return (
                        <SwiperSlide key={index}>
                          <ImageTile
                            aspectRatio={aspectRatio}
                            content={content}
                            tile={tile}
                          />
                        </SwiperSlide>
                      );
                    })}
                </Swiper>

                {!swiper && (
                  <SwiperSkeleton breakpoints={breakpoints}>
                    <div
                      className={clsx(
                        'bg-neutralLightest animate-pulse',
                        aspectRatio,
                      )}
                    />
                  </SwiperSkeleton>
                )}
              </div>

              {/* desktop */}
              {isGridOnDesktop && (
                <div
                  className="hidden gap-x-5 lg:grid"
                  style={{
                    gridTemplateColumns: `repeat(${tilesPerViewDesktop}, 1fr)`,
                  }}
                >
                  {tiles.map((tile, index) => {
                    return (
                      <div className="relative" key={index}>
                        <ImageTile
                          aspectRatio={aspectRatio}
                          content={content}
                          tile={tile}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Container>
  );
}

ImageTiles.displayName = 'ImageTiles';
ImageTiles.Schema = Schema;
