import {Fragment} from 'react';

import {getAspectRatioFromClass} from '~/lib/utils';
import {Image, Link} from '~/components';

import type {ImageTileProps} from './ImageTiles.types';

export function ImageTile({
  aspectRatio = 'aspect-[3/4]',
  content,
  tile,
}: ImageTileProps) {
  const firstLink = tile.buttons?.[0]?.link;
  const secondLink = tile.buttons?.[1]?.link;

  return (
    <Link
      aria-label={firstLink?.text}
      className="w-full"
      to={content?.clickableImage ? firstLink?.url : ''}
      newTab={firstLink?.newTab}
      type={firstLink?.type}
    >
      <Image
        data={{
          altText: tile.alt,
          url: tile.image?.src,
          width: tile.image?.width,
          height: tile.image?.height,
        }}
        aspectRatio={getAspectRatioFromClass(aspectRatio)}
        crop={tile.crop}
        sizes="(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 100vw"
      />

      <div
        className={`pointer-events-none absolute inset-0 flex h-full w-full p-6 text-center md:p-8 ${
          content?.darkOverlay ? 'bg-[rgba(0,0,0,0.2)]' : ''
        } ${content?.contentPosition}`}
      >
        <div className="pointer-events-auto flex flex-col gap-3 lg:gap-4">
          {tile.heading && (
            <h3 className="text-xl text-white sm:text-2xl">{tile.heading}</h3>
          )}

          {!content?.hideButtons && (firstLink?.text || secondLink?.text) && (
            <div className="flex flex-wrap justify-center gap-3">
              {tile.buttons?.slice(0, 2).map(({link}, index) => {
                // hide second button if clickable image is enabled
                if (content?.clickableImage && index > 0) return null;

                return link?.text ? (
                  <Fragment key={index}>
                    {}
                    <Link
                      aria-label={link.text}
                      className={`${
                        index === 1
                          ? content?.secondaryButtonStyle
                          : content?.primaryButtonStyle
                      }`}
                      to={!content?.clickableImage ? link.url : ''}
                      newTab={link.newTab}
                      type={link.type}
                    >
                      {link.text}
                    </Link>
                  </Fragment>
                ) : null;
              })}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

ImageTile.displayName = 'ImageTile';
