import {useRef} from 'react';
import {useInView} from 'react-intersection-observer';

import type {BannerVideoProps} from './Banner.types';

export function BannerVideo({
  aboveTheFold,
  posterUrl,
  video,
}: BannerVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const {ref, inView} = useInView({
    rootMargin: '200px',
    triggerOnce: true,
  });

  return (
    <div ref={ref} className="absolute inset-0 size-full">
      {(aboveTheFold || inView) && (
        <video
          className="size-full object-cover"
          autoPlay
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
      )}
    </div>
  );
}

BannerVideo.displayName = 'BannerVideo';
