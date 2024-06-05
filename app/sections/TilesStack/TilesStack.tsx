import {getAspectRatioFromClass} from '~/lib/utils';
import {Container, Image, Link, Svg} from '~/components';

import {Schema} from './TilesStack.schema';
import type {TilesStackCms} from './TilesStack.types';

export function TilesStack({cms}: {cms: TilesStackCms}) {
  const {header, section, tiles} = cms;
  const {
    heading,
    subheading,
    alignment = 'text-center items-center',
  } = {...header};
  const {
    aspectRatio = 'aspect-[5/4]',
    textColor = 'var(--text)',
    textAlign = 'text-left items-start',
    tileHeadingSize = 'text-h4',
    fullWidth,
  } = {...section};
  const maxWidthClass = fullWidth
    ? 'max-w-none'
    : 'max-w-[var(--content-max-width)]';

  return (
    <Container container={cms.container}>
      <div className="px-contained py-contained">
        {(!!heading || !!subheading) && (
          <div
            className={`max-lg:px-contained mx-auto mb-6 flex w-full flex-col gap-2 md:mb-10 ${alignment} ${maxWidthClass}`}
            style={{color: textColor}}
          >
            {heading && <h2 className="text-h2">{heading}</h2>}
            {subheading && <span className="text-body-lg">{subheading}</span>}
          </div>
        )}

        {tiles?.length > 0 && (
          <div
            className={`${maxWidthClass} mx-auto grid gap-5 md:auto-cols-fr md:grid-flow-col lg:gap-x-8`}
            style={{color: textColor}}
          >
            {tiles.map((item, index) => {
              return (
                <div key={index} className="flex w-full flex-col gap-4">
                  <Link
                    aria-label={item.heading}
                    to={item.link?.url}
                    newTab={item.link?.newTab}
                    tabIndex={-1}
                    type={item.link?.type}
                  >
                    <Image
                      data={{
                        altText: item.image?.altText || item.alt,
                        url: item.image?.src,
                        width: item.image?.width,
                        height: item.image?.height,
                      }}
                      aspectRatio={getAspectRatioFromClass(aspectRatio)}
                      crop={item.crop}
                      sizes="(min-width: 1024px) 40vw, 100vw"
                    />
                  </Link>

                  <div className={`flex flex-col ${textAlign}`}>
                    <Link
                      aria-label={item.heading}
                      to={item.link?.url}
                      newTab={item.link?.newTab}
                      type={item.link?.type}
                    >
                      <div className="group flex">
                        <h3 className={`${tileHeadingSize}`}>{item.heading}</h3>

                        <span className="ml-3 block max-w-5 transition-transform lg:w-6 lg:group-hover:translate-x-2">
                          <Svg
                            src="/svgs/arrow-right.svg#arrow-right"
                            title="Arrow"
                            viewBox="0 0 24 24"
                          />
                        </span>
                      </div>
                    </Link>

                    {item.description && (
                      <p className="mt-1 text-base">{item.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Container>
  );
}

TilesStack.displayName = 'TilesStack';
TilesStack.Schema = Schema;
