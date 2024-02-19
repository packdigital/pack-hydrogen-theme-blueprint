import {Container} from '~/components';

import type {ImageTilesGridCms} from './ImageTilesGrid.types';
import {ImageTilesGridItem} from './ImageTilesGridItem';
import {Schema} from './ImageTilesGrid.schema';

export function ImageTilesGrid({cms}: {cms: ImageTilesGridCms}) {
  const {content, heading, subheading, section, tiles} = cms;
  const {aspectRatio, desktop, tablet, mobile, fullWidth} = {...section};

  const maxWidthClass = fullWidth
    ? 'max-w-none'
    : 'max-w-[var(--content-max-width)]';
  const gridColsClasses = `${desktop?.gridCols || 'lg:grid-cols-3'} ${
    tablet?.gridCols || 'max-lg:grid-cols-2'
  } ${mobile?.gridCols || 'max-md:grid-cols-1'}`;
  const gapClasses = `${desktop?.gap || 'lg:gap-2'} ${
    tablet?.gap || 'max-lg:gap-2'
  } ${mobile?.gap || 'max-md:gap-2'}`;
  const fullBleedClasses = `${
    desktop?.fullBleed ? 'lg:px-0' : 'lg:px-contained'
  } ${tablet?.fullBleed ? 'max-lg:px-0' : 'max-lg:px-contained'} ${
    mobile?.fullBleed ? 'max-md:px-0' : 'max-md:px-contained'
  }`;

  return (
    <Container container={cms.container}>
      <div className={`py-4 md:py-6 ${fullBleedClasses}`}>
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
            <div className={`grid ${gridColsClasses} ${gapClasses}`}>
              {tiles.map((tile, index) => {
                return (
                  <div className="relative" key={index}>
                    <ImageTilesGridItem
                      aspectRatio={aspectRatio}
                      content={content}
                      tile={tile}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}

ImageTilesGrid.displayName = 'ImageTilesGrid';
ImageTilesGrid.Schema = Schema;
