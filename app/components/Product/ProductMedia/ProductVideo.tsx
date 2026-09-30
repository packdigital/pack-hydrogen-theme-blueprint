import {useEffect} from 'react';
import type {Video} from '@shopify/hydrogen/storefront-api-types';

import {VideoPlayToggle} from '~/components/VideoPlayToggle';
import {useVideoPauseControl} from '~/hooks';

import type {ProductVideoProps} from './ProductMedia.types';

export function ProductVideo({
  inView,
  media,
  onLoad,
  priority,
}: ProductVideoProps) {
  const {video: videoEl, videoRef, isPaused, toggle} = useVideoPauseControl();

  const {sources, previewImage} = media as Video;

  useEffect(() => {
    if (inView) {
      videoEl?.play().catch(() => {});
    } else {
      videoEl?.pause();
    }
  }, [inView, videoEl]);

  useEffect(() => {
    if (inView && typeof onLoad === 'function') onLoad();
  }, [inView]);

  return (
    <>
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

      <VideoPlayToggle isPaused={isPaused} onToggle={toggle} />
    </>
  );
}

ProductVideo.displayName = 'ProductVideo';
