import {forwardRef} from 'react';

import type {ProductItemVideoProps} from '../ProductItem.types';

export const ProductItemVideo = forwardRef(
  (
    {autoPlay = false, media}: ProductItemVideoProps,
    ref: React.Ref<HTMLVideoElement> | undefined,
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

ProductItemVideo.displayName = 'ProductItemVideo';
