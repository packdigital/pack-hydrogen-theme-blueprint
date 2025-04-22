import {Fragment} from 'react';
import clsx from 'clsx';

import {getAspectRatioFromClass} from '~/lib/utils';
import {Image} from '~/components/Image';
import {Link} from '~/components/Link';

import type {ImageTilesGridItemProps} from './ImageTilesGrid.types';

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

export function ImageTilesGridItem({
  aspectRatio = 'aspect-[1/1]',
  content,
  tile,
}: ImageTilesGridItemProps) {
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
          url: tile.image?.url,
          width: tile.image?.width,
          height: tile.image?.height,
        }}
        aspectRatio={getAspectRatioFromClass(aspectRatio)}
        crop={tile.crop}
        sizes="(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 100vw"
      />

      <div
        className={clsx(
          'pointer-events-none absolute inset-0 flex size-full p-6 text-center md:p-8',
          darkOverlay && 'bg-[rgba(0,0,0,0.2)]',
          contentPosition,
        )}
      >
        <div
          className={clsx(
            'pointer-events-auto flex w-full flex-col gap-3 lg:gap-4',
            alignment.text,
          )}
        >
          {tile.heading && (
            <h3 className={clsx('text-white', tileHeadingSize)}>
              {tile.heading}
            </h3>
          )}

          {!hideButtons && (firstLink?.text || secondLink?.text) && (
            <div className={clsx('flex flex-wrap gap-3', alignment.buttons)}>
              {tile.buttons?.slice(0, 2).map(({link}, index) => {
                /* hide second button if clickable image is enabled */
                if (clickableImage && index > 0) return null;

                return link?.text ? (
                  <Fragment key={index}>
                    <Link
                      aria-label={link.text}
                      className={clsx(
                        index === 1 ? secondaryButtonStyle : primaryButtonStyle,
                      )}
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

ImageTilesGridItem.displayName = 'ImageTilesGridItem';
