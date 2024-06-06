import {Fragment} from 'react';

import {Image, Link} from '~/components';

import type {ImageTilesMosaicItemProps} from './ImageTilesMosaic.types';

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

export function ImageTilesMosaicItem({
  content,
  tile,
}: ImageTilesMosaicItemProps) {
  const {
    contentPosition,
    contentAlign = 'center',
    tileHeadingSize = 'text-h4',
    clickableImage,
    darkOverlay,
  } = {...content};
  const firstLink = tile?.buttons?.[0]?.link;
  const secondLink = tile?.buttons?.[1]?.link;
  const alignment = ALIGNMENT_CLASSES[contentAlign];

  return (
    <div className="absolute inset-0 size-full">
      <Link
        aria-label={firstLink?.text}
        className="size-full"
        to={clickableImage ? firstLink?.url : ''}
        newTab={firstLink?.newTab}
        type={firstLink?.type}
      >
        <Image
          data={{
            altText: tile?.image?.altText || tile?.alt,
            url: tile?.image?.src,
            width: tile?.image?.width,
            height: tile?.image?.height,
          }}
          className={`media-fill ${tile?.positionMobile} ${tile?.positionDesktop}`}
          sizes="(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 100vw"
        />

        <div
          className={`pointer-events-none absolute inset-0 z-[1] flex size-full p-6 text-center md:p-8 ${
            darkOverlay ? 'bg-[rgba(0,0,0,0.2)]' : ''
          } ${contentPosition}`}
        >
          <div className="pointer-events-auto flex w-full flex-col gap-3 lg:gap-4">
            {(!!tile?.heading || !!tile?.subheading) && (
              <div className={`flex flex-col ${alignment.text}`}>
                {tile?.heading && (
                  <h3 className={`text-white ${tileHeadingSize}`}>
                    {tile.heading}
                  </h3>
                )}
                {tile?.subheading && (
                  <span className="text-base text-white">
                    {tile.subheading}
                  </span>
                )}
              </div>
            )}

            {!tile?.hideButton && (firstLink?.text || secondLink?.text) && (
              <div className={`flex flex-wrap gap-3 ${alignment.buttons}`}>
                {tile?.buttons?.slice(0, 2).map(({link, style}, index) => {
                  // hide second button if clickable image is enabled
                  if (clickableImage && index > 0) return null;

                  return link?.text ? (
                    <Fragment key={index}>
                      <Link
                        aria-label={link.text}
                        className={`${style}`}
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
    </div>
  );
}

ImageTilesMosaicItem.displayName = 'ImageTilesMosaicItem';
