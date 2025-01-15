import {useEffect, useRef} from 'react';

import type {HeroVideoProps} from './Hero.types';

export function HeroVideo({isVisible, posterUrl, video}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isVisible) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, [isVisible]);

  return isVisible ? (
    <video
      className="absolute inset-0 size-full object-cover"
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
  ) : null;
}

HeroVideo.displayName = 'HeroVideo';
