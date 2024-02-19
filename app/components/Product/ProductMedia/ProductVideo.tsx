import {useEffect, useRef} from 'react';
import type {MediaEdge, Video} from '@shopify/hydrogen/storefront-api-types';

interface ProductVideoProps {
  inView: boolean;
  media: MediaEdge['node'];
  onLoad?: () => void;
}

export function ProductVideo({inView, media, onLoad}: ProductVideoProps) {
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
      poster={previewImage?.url}
      className="media-fill"
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
