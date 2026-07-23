import clsx from 'clsx';

import {Carousel} from '~/components/Carousel';
import {Container} from '~/components/Container';

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
              <div className={clsx('relative', isGridOnDesktop && 'lg:hidden')}>
                <Carousel
                  ariaLabel={heading || 'Image tiles'}
                  gap={{base: 16, md: 20}}
                  slides={tiles.map((tile, index) => (
                    <ImageTile
                      aspectRatio={aspectRatio}
                      content={content}
                      key={index}
                      tile={tile}
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
