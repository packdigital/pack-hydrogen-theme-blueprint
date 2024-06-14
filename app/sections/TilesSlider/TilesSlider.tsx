import {
  Container,
  Link,
  TilesSlider as TilesSliderComponent,
} from '~/components';

import type {TilesSliderCms} from './TilesSlider.types';
import {Schema} from './TilesSlider.schema';

export function TilesSlider({cms}: {cms: TilesSliderCms}) {
  const {button, header, section, tiles} = cms;
  const {
    heading,
    subheading,
    alignment = 'text-center items-center',
  } = {...header};
  const {
    aspectRatio,
    buttonStyle = 'btn-primary',
    fullWidth,
    textColor = 'var(--text)',
    textAlign = 'text-left items-start',
    tileHeadingSize,
    tilesPerViewDesktop,
    tilesPerViewMobile,
    tilesPerViewTablet,
  } = {...section};

  const maxWidthClass = fullWidth
    ? 'max-w-none'
    : 'max-w-[var(--content-max-width)]';

  return (
    <Container container={cms.container}>
      <div className="lg:px-contained py-contained overflow-x-clip">
        {(!!heading || !!subheading) && (
          <div
            className={`max-lg:px-contained mx-auto mb-6 flex w-full flex-col gap-2 md:mb-10 ${alignment} ${maxWidthClass}`}
            style={{color: textColor}}
          >
            {heading && <h2 className="text-h2">{heading}</h2>}
            {subheading && <span className="text-body-lg">{subheading}</span>}
          </div>
        )}

        <TilesSliderComponent
          aspectRatio={aspectRatio}
          maxWidthClass={maxWidthClass}
          textColor={textColor}
          textAlign={textAlign}
          tileHeadingSize={tileHeadingSize}
          tiles={tiles}
          tilesPerViewDesktop={tilesPerViewDesktop}
          tilesPerViewMobile={tilesPerViewMobile}
          tilesPerViewTablet={tilesPerViewTablet}
        />

        {button?.text && (
          <div className={`mt-10 flex w-full flex-col ${alignment}`}>
            <Link
              aria-label={button.text}
              className={`${buttonStyle}`}
              to={button.url}
              newTab={button.newTab}
              type={button.type}
            >
              {button.text}
            </Link>
          </div>
        )}
      </div>
    </Container>
  );
}

TilesSlider.displayName = 'TilesSlider';
TilesSlider.Schema = Schema;
