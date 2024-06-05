import {Fragment} from 'react';

import {getAspectRatioFromClass} from '~/lib/utils';
import {Image, Link} from '~/components';

import type {ImageTileProps} from './ImageTiles.types';

const ALIGNMENT_CLASSES: Record<string, {text: string; buttons: string}> = {
  left: {
    text: 'text-left items-start',
    buttons: 'justify-start',
  },
  center: {
    text: 'text-center items-center',
    buttons: 'justify-center',
  },
  right: {
    text: 'text-right items-end',
    buttons: 'justify-end',
  },
};

export function ImageTile({
  aspectRatio = 'aspect-[3/4]',
  content,
  tile,
}: ImageTileProps) {
  const {
    contentPosition,
    contentAlign = 'center',
    tileHeadingSize = 'text-h3',
    hideButtons,
    clickableImage,
    darkOverlay,
    primaryButtonStyle,
    secondaryButtonStyle,
  } = {...content};
  const firstLink = tile.buttons?.[0]?.link;
  const secondLink = tile.buttons?.[1]?.link;
  const alignment = ALIGNMENT_CLASSES[contentAlign];

  return (
    <Link
      aria-label={firstLink?.text}
      className="w-full"
      to={clickableImage ? firstLink?.url : ''}
      newTab={firstLink?.newTab}
      type={firstLink?.type}
    >
      <Image
        data={{
          altText: tile.image?.altText || tile.alt,
          url: tile.image?.src,
          width: tile.image?.width,
          height: tile.image?.height,
        }}
        aspectRatio={getAspectRatioFromClass(aspectRatio)}
        crop={tile.crop}
        sizes="(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 100vw"
      />

      <div
        className={`pointer-events-none absolute inset-0 flex size-full p-6 text-center md:p-8 ${
          darkOverlay ? 'bg-[rgba(0,0,0,0.2)]' : ''
        } ${contentPosition}`}
      >
        <div
          className={`pointer-events-auto flex w-full flex-col gap-3 lg:gap-4 ${alignment.text}`}
        >
          {tile.heading && (
            <h3 className={`text-white ${tileHeadingSize}`}>{tile.heading}</h3>
          )}

          {!hideButtons && (firstLink?.text || secondLink?.text) && (
            <div className={`flex flex-wrap gap-3 ${alignment.buttons}`}>
              {tile.buttons?.slice(0, 2).map(({link}, index) => {
                // hide second button if clickable image is enabled
                if (clickableImage && index > 0) return null;

                return link?.text ? (
                  <Fragment key={index}>
                    {}
                    <Link
                      aria-label={link.text}
                      className={`${
                        index === 1 ? secondaryButtonStyle : primaryButtonStyle
                      }`}
                      to={!clickableImage ? link.url : ''}
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
