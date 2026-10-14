import {useEffect} from 'react';

import {VideoPlayToggle} from '~/components/VideoPlayToggle';
import {useVideoPauseControl} from '~/hooks';

import type {HeroVideoProps} from './Hero.types';

export function HeroVideo({isVisible, posterUrl, video}: HeroVideoProps) {
  const {video: videoEl, videoRef, isPaused, toggle} = useVideoPauseControl();

  useEffect(() => {
    if (!videoEl) return;
    if (isVisible) {
      videoEl.play().catch(() => {});
    } else {
      videoEl.pause();
    }
  }, [isVisible, videoEl]);

  return isVisible ? (
    <>
      <video
        className="media-fill"
        controls={false}
        loop
        muted
        playsInline
        poster={posterUrl}
        ref={videoRef}
        key={video?.url}
      >
        {video?.url && <source src={video.url} type={video.format} />}
      </video>

      <VideoPlayToggle
        className="z-[2]"
        isPaused={isPaused}
        onToggle={toggle}
      />
    </>
  ) : null;
}

HeroVideo.displayName = 'HeroVideo';
