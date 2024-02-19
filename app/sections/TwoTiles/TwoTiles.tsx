import {getAspectRatioFromClass} from '~/lib/utils';
import {Container, Image, Link, Svg} from '~/components';

import {Schema} from './TwoTiles.schema';
import type {TwoTilesCms} from './TwoTiles.types';

export function TwoTiles({cms}: {cms: TwoTilesCms}) {
  const {section, tiles} = cms;
  const {aspectRatio = 'aspect-[5/4]', fullWidth} = {...section};
  const maxWidthClass = fullWidth
    ? 'max-w-none'
    : 'max-w-[var(--content-max-width)]';

  return (
    <Container container={cms.container}>
      <div className="px-contained py-contained">
        <div
          className={`${maxWidthClass} mx-auto grid gap-x-5 gap-y-5 md:grid-cols-2 lg:gap-x-8`}
        >
          {tiles?.slice(0, 2).map((item, index) => {
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
                      altText: item.alt,
                      url: item.image?.src,
                      width: item.image?.width,
                      height: item.image?.height,
                    }}
                    aspectRatio={getAspectRatioFromClass(aspectRatio)}
                    crop={item.crop}
                    sizes="(min-width: 1024px) 40vw, 100vw"
                  />
                </Link>

                <div className="flex flex-col items-start">
                  <Link
                    aria-label={item.heading}
                    to={item.link?.url}
                    newTab={item.link?.newTab}
                    type={item.link?.type}
                  >
                    <div className="group flex">
                      <h3 className="text-2xl lg:text-3xl">{item.heading}</h3>

                      <span className="ml-[0.75rem] block max-w-[1.25rem] transition-transform lg:w-[1.5rem] lg:group-hover:translate-x-2">
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
      </div>
    </Container>
  );
}

TwoTiles.displayName = 'TwoTiles';
TwoTiles.Schema = Schema;
