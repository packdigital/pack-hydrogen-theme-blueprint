import {memo} from 'react';
import {useInView} from 'react-intersection-observer';
import clsx from 'clsx';

import {getAspectRatioFromClass, getVideoSrcWithFirstFrame} from '~/lib/utils';
import {Image} from '~/components/Image';
import {Link} from '~/components/Link';
import {VideoPlayButton} from '~/components/VideoPlayButton';
import {usePlayWhileInView} from '~/hooks';

import type {CollectionPromoTileProps} from './Collection.types';

function CollectionPromoTileVideo({
  format,
  posterUrl,
  url,
}: {
  format?: string;
  posterUrl?: string;
  url?: string;
}) {
  const {inViewRef, videoRef, isAutoplayBlocked, play} = usePlayWhileInView();

  return (
    <div className="media-fill" ref={inViewRef}>
      <video
        className="media-fill"
        controls={false}
        loop
        muted
        playsInline
        poster={posterUrl}
        preload="metadata"
        ref={videoRef}
        key={url}
      >
        <source src={getVideoSrcWithFirstFrame(url)} type={format} />
      </video>

      {isAutoplayBlocked && <VideoPlayButton onPlay={play} />}
    </div>
  );
}

export const CollectionPromoTile = memo(({tile}: CollectionPromoTileProps) => {
  const {ref, inView} = useInView({
    rootMargin: '200px',
    triggerOnce: true,
  });

  const {aspectRatio = 'aspect-[3/4]', background, link, text} = tile;
  const {alt, bgColor, darkOverlay, media, videoPoster} = {
    ...background,
  };
  const hasVideo = media?.mediaType === 'VIDEO';

  return (
    <Link
      aria-label={text?.heading || link?.text}
      className="h-full"
      to={link?.url}
      newTab={link?.newTab}
      ref={ref}
      type={link?.type}
    >
      <div
        className={clsx('relative overflow-hidden', aspectRatio)}
        style={{
          backgroundColor: media ? 'var(--neutral-lightest)' : bgColor,
        }}
      >
        {inView && (
          <>
            {hasVideo && (
              <CollectionPromoTileVideo
                format={media.format}
                posterUrl={videoPoster?.url}
                url={media.url}
              />
            )}

            {media?.url && !hasVideo && (
              <Image
                data={{
                  altText: media.altText || alt,
                  url: media.url,
                }}
                aspectRatio={getAspectRatioFromClass(aspectRatio)}
                className="media-fill"
                sizes="(min-width: 768px) 33vw, 50vw"
              />
            )}

            {(hasVideo || media?.url) && darkOverlay && (
              <div className="pointer-events-none absolute inset-0 size-full bg-[rgba(0,0,0,0.2)]" />
            )}
          </>
        )}

        {(text?.heading || text?.subtext) && (
          <div
            className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 px-4 text-center"
            style={{color: text?.textColor}}
          >
            <h3 className="text-xl lg:text-2xl">{text?.heading}</h3>

            {text?.subtext && (
              <p className="mt-4 text-sm lg:text-base">{text?.subtext}</p>
            )}
          </div>
        )}
      </div>
    </Link>
  );
});

CollectionPromoTile.displayName = 'CollectionPromoTile';
