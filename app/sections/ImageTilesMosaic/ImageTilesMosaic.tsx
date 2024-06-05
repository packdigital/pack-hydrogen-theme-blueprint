import {Container} from '~/components';

import type {ImageTilesMosaicCms} from './ImageTilesMosaic.types';
import {ImageTilesMosaicItem} from './ImageTilesMosaicItem';
import {Schema} from './ImageTilesMosaic.schema';

const GRID_LAYOUT_CONFIG: Record<string, Record<string, any>> = {
  '2-wide': {
    count: 2,
    gridClasses: '',
    cellClasses: 'md:col-span-2',
  },
  '2-tall': {
    count: 2,
    gridClasses: '',
    cellClasses: 'md:row-span-2',
  },
  '1-wide-2-square': {
    count: 3,
    gridClasses: '',
    cellClasses: 'md:first:col-span-2',
  },
  '2-square-1-wide': {
    count: 3,
    gridClasses: '',
    cellClasses: 'md:last:col-span-2',
  },
  '1-tall-2-square': {
    count: 3,
    gridClasses: 'md:grid-flow-col',
    cellClasses: 'md:first:row-span-2',
  },
  '2-square-1-tall': {
    count: 3,
    gridClasses: 'md:grid-flow-col',
    cellClasses: 'md:last:row-span-2',
  },
  '4-square': {
    count: 4,
    gridClasses: '',
    cellClasses: '',
  },
};

export function ImageTilesMosaic({cms}: {cms: ImageTilesMosaicCms}) {
  const {content, grid, header, primary, section} = cms;
  const {
    heading,
    subheading,
    alignment = 'text-center items-center',
  } = {...header};
  const {
    desktop,
    tablet,
    mobile,
    textColor = 'var(--text)',
    fullWidth,
  } = {...section};

  const gridConfig = GRID_LAYOUT_CONFIG[grid?.gridLayout || '1-wide-2-square'];
  const maxWidthClass = fullWidth
    ? 'max-w-none'
    : 'max-w-[var(--content-max-width)]';
  const fullBleedClasses = `${
    desktop?.fullBleed ? 'lg:px-0' : 'lg:px-contained'
  } ${tablet?.fullBleed ? 'max-lg:px-0' : 'max-lg:px-contained'} ${
    mobile?.fullBleed ? 'max-md:px-0' : 'max-md:px-contained'
  }`;
  const gapClasses = `${desktop?.gap || 'lg:gap-2'} ${
    tablet?.gap || 'max-lg:gap-2'
  } ${mobile?.gap || 'max-md:gap-2'}`;
  const primaryPlacementMobile =
    primary?.placementMobile === 'bottom' ? 'max-md:order-2' : 'max-md:order-1';
  const primaryPlacementDesktop =
    primary?.placementDesktop === 'right' ? 'md:order-2' : 'md:order-1';
  const gridPlacementMobile =
    primary?.placementMobile === 'bottom' ? 'max-md:order-1' : 'max-md:order-2';
  const gridPlacementDesktop =
    primary?.placementDesktop === 'right' ? 'md:order-1' : 'md:order-2';

  return (
    <Container container={cms.container}>
      <div className="py-contained flex flex-col gap-10">
        {(!!heading || !!subheading) && (
          <div
            className={`px-contained mx-auto mb-6 flex w-full flex-col gap-2 ${alignment} ${maxWidthClass}`}
            style={{color: textColor}}
          >
            {heading && <h2 className="text-h2">{heading}</h2>}
            {subheading && <span className="text-body-lg">{subheading}</span>}
          </div>
        )}

        <div
          className={`grid w-full grid-cols-1 md:grid-cols-2 ${gapClasses} ${fullBleedClasses}`}
        >
          <div
            className={`relative ${primary?.aspectRatioMobile} ${primary?.aspectRatioDesktop} ${primaryPlacementMobile} ${primaryPlacementDesktop}`}
          >
            <ImageTilesMosaicItem content={content} tile={primary} />
          </div>

          <div
            className={`grid h-full grid-cols-1 gap-2.5 md:grid-cols-2 md:grid-rows-2 ${gridConfig.gridClasses} ${gridPlacementMobile} ${gridPlacementDesktop}`}
          >
            {grid?.tiles?.slice(0, gridConfig.count).map((tile, index) => {
              return (
                <div
                  className={`relative ${tile.aspectRatioMobile} ${gridConfig.cellClasses}`}
                  key={index}
                >
                  <ImageTilesMosaicItem content={content} tile={tile} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Container>
  );
}

ImageTilesMosaic.displayName = 'ImageTilesMosaic';
ImageTilesMosaic.Schema = Schema;
