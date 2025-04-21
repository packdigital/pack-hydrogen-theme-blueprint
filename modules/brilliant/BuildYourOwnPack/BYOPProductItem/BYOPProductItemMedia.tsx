import type {
  ExternalVideo,
  MediaImage,
  Model3d,
  Video,
} from '@shopify/hydrogen-react/storefront-api-types';
import {forwardRef, useMemo, useRef} from 'react';

import type {
  BYOPProductItemMediaProps,
  BYOPProductItemVideoProps,
} from './BYOPProductItem.types';

import {Image} from '~/components/Image';

export function BYOPProductItemMedia({
  media = [],
  productTitle = '',
}: BYOPProductItemMediaProps) {
  const hoverVideoRef = useRef<HTMLVideoElement>(null);

  // Ensure media is always an array
  const safeMedia = useMemo(() => (Array.isArray(media) ? media : []), [media]);

  const [primaryMedia, hoverMedia] = [...safeMedia];

  const handleMouseEnter = () => {
    if (hoverMedia?.mediaContentType !== 'VIDEO') return;
    hoverVideoRef.current?.play();
  };

  const handleMouseLeave = () => {
    if (hoverMedia?.mediaContentType !== 'VIDEO') return;
    hoverVideoRef.current?.pause();
  };

  return (
    <div
      className="group/media relative aspect-[var(--product-image-aspect-ratio)] w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {primaryMedia && (
        <div
          className={`absolute inset-0 ${
            hoverMedia
              ? 'opacity-100 transition duration-300 md:group-hover/media:opacity-0'
              : ''
          }`}
        >
          {primaryMedia.mediaContentType === 'VIDEO' ? (
            <BYOPProductItemVideo autoPlay media={primaryMedia as Video} />
          ) : (
            <div className="size-full">
              <Image
                data={{
                  ...primaryMedia.previewImage,
                  altText: productTitle || 'Product image',
                  url: primaryMedia.previewImage?.url || '',
                  width: primaryMedia.previewImage?.width || 0,
                  height: primaryMedia.previewImage?.height || 0,
                }}
                aspectRatio="5/4"
                className="size-full rounded-md object-cover"
                loading="eager"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}
        </div>
      )}

      {hoverMedia && (
        <div className="absolute inset-0 hidden opacity-0 transition duration-300 md:block md:group-hover/media:opacity-100">
          {hoverMedia.mediaContentType === 'VIDEO' ? (
            <BYOPProductItemVideo
              autoPlay={false}
              media={hoverMedia as Video}
              ref={hoverVideoRef}
            />
          ) : (
            <div className="size-full">
              <Image
                data={{
                  ...hoverMedia.previewImage,
                  altText: productTitle || 'Product hover image',
                  url: hoverMedia.previewImage?.url || '',
                  width: hoverMedia.previewImage?.width || 0,
                  height: hoverMedia.previewImage?.height || 0,
                }}
                className="size-full rounded-md object-cover"
                sizes="(min-width: 1280px) 20vw, (min-width: 768px) 30vw, 45vw"
              />
            </div>
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
    if (!media) return null;

    const {sources = [], previewImage} = media;
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
        poster={previewImage?.url || ''}
        className="size-full rounded-md object-cover"
        key={JSON.stringify(videoSources)}
      >
        {videoSources?.length
          ? videoSources.map((source) => {
              return (
                <source
                  key={source.url}
                  src={source.url || ''}
                  type={source.mimeType || 'video/mp4'}
                />
              );
            })
          : null}
      </video>
    );
  },
);

BYOPProductItemVideo.displayName = 'BYOPProductItemVideo';
