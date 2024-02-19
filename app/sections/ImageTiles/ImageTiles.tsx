import {useState} from 'react';
import type {SwiperClass} from 'swiper/react';
import {Swiper, SwiperSlide} from 'swiper/react';

import {Container, Spinner} from '~/components';

import type {ImageTilesCms} from './ImageTiles.types';
import {ImageTile} from './ImageTile';
import {Schema} from './ImageTiles.schema';

export function ImageTiles({cms}: {cms: ImageTilesCms}) {
  const {content, heading, subheading, section, tiles} = cms;

  const [swiper, setSwiper] = useState<SwiperClass | null>(null);

  const maxWidthClass = section?.fullWidth
    ? 'max-w-none'
    : 'max-w-[var(--content-max-width)]';

  return (
    <Container container={cms.container}>
      <div className="lg:px-contained py-4 md:py-6">
        <div className={`mx-auto ${maxWidthClass}`}>
          {(!!heading || !!subheading) && (
            <div className="mb-6 px-4 text-center">
              {heading && <h2 className="text-title-h2">{heading}</h2>}
              {subheading && (
                <h4 className="text-title-h4 mt-2">{subheading}</h4>
              )}
            </div>
          )}

          {tiles?.length > 0 && (
            <>
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
                      slidesPerView: tiles.length < 3 ? 1.4 : 2.4,
                      slidesOffsetBefore: 32,
                      slidesOffsetAfter: 32,
                      spaceBetween: 20,
                    },
                  }}
                >
                  {swiper &&
                    tiles.slice(0, 3).map((tile, index) => {
                      return (
                        <SwiperSlide key={index}>
                          <ImageTile
                            aspectRatio={section?.aspectRatio}
                            content={content}
                            tile={tile}
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
              <div
                className={`hidden gap-x-5 lg:grid ${
                  tiles.length < 3 ? 'grid-cols-2' : 'grid-cols-3'
                }`}
              >
                {tiles.slice(0, 3).map((tile, index) => {
                  return (
                    <div className="relative" key={index}>
                      <ImageTile
                        aspectRatio={section?.aspectRatio}
                        content={content}
                        tile={tile}
                      />
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </Container>
  );
}

ImageTiles.displayName = 'ImageTiles';
ImageTiles.Schema = Schema;
