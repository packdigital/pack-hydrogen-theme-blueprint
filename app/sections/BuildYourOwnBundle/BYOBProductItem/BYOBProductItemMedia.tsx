import {forwardRef, useRef} from 'react';
import type {Video} from '@shopify/hydrogen-react/storefront-api-types';

import {Image} from '~/components';

import type {
  BYOBProductItemMediaProps,
  BYOBProductItemVideoProps,
} from './BYOBProductItem.types';

export function BYOBProductItemMedia({
  media,
  productTitle,
}: BYOBProductItemMediaProps) {
  const hoverVideoRef = useRef<HTMLVideoElement>(null);

  const [primaryMedia, hoverMedia] = [...(media || [])];

  return (
    <div
      className="group/media relative aspect-[var(--product-image-aspect-ratio)]"
      onMouseEnter={() => {
        if (hoverMedia?.mediaContentType !== 'VIDEO') return;
        hoverVideoRef.current?.play();
      }}
      onMouseLeave={() => {
        if (hoverMedia?.mediaContentType !== 'VIDEO') return;
        hoverVideoRef.current?.pause();
      }}
    >
      {primaryMedia && (
        <div
          className={`${
            hoverMedia
              ? 'opacity-100 transition duration-300 md:group-hover/media:opacity-0'
              : ''
          }`}
        >
          {primaryMedia.mediaContentType === 'VIDEO' ? (
            <BYOBProductItemVideo autoPlay media={primaryMedia as Video} />
          ) : (
            <Image
              data={{
                ...primaryMedia.previewImage,
                altText: productTitle,
              }}
              className="media-fill"
              loading="eager"
              sizes="(min-width: 1280px) 20vw, (min-width: 768px) 30vw, 45vw"
            />
          )}
        </div>
      )}

      {hoverMedia && (
        <div className="hidden opacity-0 transition duration-300 md:block md:group-hover/media:opacity-100">
          {hoverMedia.mediaContentType === 'VIDEO' ? (
            <BYOBProductItemVideo
              autoPlay={false}
              media={hoverMedia as Video}
              ref={hoverVideoRef}
            />
          ) : (
            <Image
              data={{
                ...hoverMedia.previewImage,
                altText: productTitle,
              }}
              className="media-fill"
              sizes="(min-width: 1280px) 20vw, (min-width: 768px) 30vw, 45vw"
            />
          )}
        </div>
      )}

      {/* loading shimmer */}
      {!primaryMedia && (
        <div className="relative size-full overflow-hidden">
          <div className="loading-shimmer opacity-60" />
        </div>
      )}
    </div>
  );
}

BYOBProductItemMedia.displayName = 'BYOBProductItemMedia';

export const BYOBProductItemVideo = forwardRef(
  (
    {autoPlay = false, media}: BYOBProductItemVideoProps,
    ref: React.LegacyRef<HTMLVideoElement> | undefined,
  ) => {
    const {sources, previewImage} = media;
    const videoSources = sources?.filter(
      ({mimeType}) => mimeType === 'video/mp4',
    );

    return (
      <video
        ref={ref}
        autoPlay={autoPlay}
        muted
        playsInline
        loop
        controls={false}
        poster={previewImage?.url}
        className="absolute inset-0 size-full"
      >
        {videoSources?.length
          ? videoSources.map((source) => {
              return (
                <source
                  key={source.url}
                  src={source.url}
                  type={source.mimeType}
                />
              );
            })
          : null}
      </video>
    );
  },
);

BYOBProductItemVideo.displayName = 'BYOBProductItemVideo';
