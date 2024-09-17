import {useEffect, useRef} from 'react';

import type {HeroVideoProps} from './Hero.types';

export function HeroVideo({isVisible, posterSrc, videoSrc}: HeroVideoProps) {
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
      poster={posterSrc}
      ref={videoRef}
    >
      {videoSrc && <source src={videoSrc} type="video/mp4" />}
    </video>
  ) : null;
}

HeroVideo.displayName = 'HeroVideo';
