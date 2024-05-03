import {forwardRef} from 'react';
import type {Video} from '@shopify/hydrogen/storefront-api-types';

interface ProductItemVideoProps {
  autoPlay?: boolean;
  media: Video;
}

export const ProductItemVideo = forwardRef(
  (
    {autoPlay = false, media}: ProductItemVideoProps,
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

ProductItemVideo.displayName = 'ProductItemVideo';
