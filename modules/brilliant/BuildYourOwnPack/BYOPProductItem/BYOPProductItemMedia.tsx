import type {Video} from '@shopify/hydrogen-react/storefront-api-types';
import {forwardRef, useRef} from 'react';

import type {
  BYOPProductItemMediaProps,
  BYOPProductItemVideoProps,
} from './BYOPProductItem.types';

import {Image} from '~/components/Image';

export function BYOPProductItemMedia({
  media,
  productTitle,
}: BYOPProductItemMediaProps) {
  const hoverVideoRef = useRef<HTMLVideoElement>(null);

  const [primaryMedia, hoverMedia] = [...(media || [])];

  return (
    <div
      className="group/media relative aspect-[var(--product-image-aspect-ratio)] h-80"
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
            <BYOPProductItemVideo autoPlay media={primaryMedia as Video} />
          ) : (
            <Image
              data={{
                ...primaryMedia.previewImage,
                altText: productTitle,
              }}
              aspectRatio="5/4"
              className="media-fill rounded-md"
              loading="eager"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
        </div>
      )}

      {hoverMedia && (
        <div className="hidden opacity-0 transition duration-300 md:block md:group-hover/media:opacity-100">
          {hoverMedia.mediaContentType === 'VIDEO' ? (
            <BYOPProductItemVideo
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
              className="media-fill rounded-md"
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

BYOPProductItemMedia.displayName = 'BYOPProductItemMedia';

export const BYOPProductItemVideo = forwardRef(
  (
    {autoPlay = false, media}: BYOPProductItemVideoProps,
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
        key={JSON.stringify(videoSources)}
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

BYOPProductItemVideo.displayName = 'BYOPProductItemVideo';
