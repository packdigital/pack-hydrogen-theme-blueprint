import {forwardRef} from 'react';
import clsx from 'clsx';

import {Carousel} from '~/components/Carousel';
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
    const isGridOnDesktop = tiles?.length === tilesPerViewDesktop;

    return tiles?.length > 0 ? (
      <div className={clsx('mx-auto', maxWidthClass)} ref={ref}>
        {/* mobile/tablet/desktop */}
        <div className={clsx('relative', isGridOnDesktop && 'lg:hidden')}>
          <Carousel
            ariaLabel="Tiles"
            gap={{base: 16, md: 20}}
            slides={tiles.map((item, index) => (
              <TilesSliderTile
                aspectRatio={aspectRatio}
                item={item}
                key={index}
                textAlign={textAlign}
                textColor={textColor}
                tileHeadingSize={tileHeadingSize}
              />
            ))}
            slidesPerView={{
              base: tilesPerViewMobile,
              md: tilesPerViewTablet,
              lg: tilesPerViewDesktop,
            }}
            viewportClassName="max-md:px-4 md:max-lg:px-8"
          />
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
