import {useEffect, useRef} from 'react';
import type {Video} from '@shopify/hydrogen/storefront-api-types';

import type {ProductVideoProps} from './ProductMedia.types';

export function ProductVideo({
  inView,
  media,
  onLoad,
  priority,
}: ProductVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const {sources, previewImage} = media as Video;

  useEffect(() => {
    if (inView) {
      videoRef?.current?.play();
      if (typeof onLoad === 'function') onLoad();
    } else {
      videoRef?.current?.pause();
    }
  }, [inView]);

  return (
    <video
      ref={videoRef}
      muted
      playsInline
      loop
      controls={false}
      poster={priority || inView ? previewImage?.url : ''}
      className="media-fill"
      key={JSON.stringify(sources)}
    >
      {inView && sources?.length
        ? sources.map((source) => {
            if (!source?.url || !source?.mimeType) return null;
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
}

ProductVideo.displayName = 'ProductVideo';
