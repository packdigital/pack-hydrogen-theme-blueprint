import {useInView} from 'react-intersection-observer';

import {VideoPlayToggle} from '~/components/VideoPlayToggle';
import {useVideoPauseControl} from '~/hooks';

import type {BannerVideoProps} from './Banner.types';

export function BannerVideo({
  aboveTheFold,
  posterUrl,
  video,
}: BannerVideoProps) {
  const {videoRef, isPaused, toggle} = useVideoPauseControl();
  const {ref, inView} = useInView({
    rootMargin: '200px',
    triggerOnce: true,
  });

  return (
    <div ref={ref} className="absolute inset-0 size-full">
      {(aboveTheFold || inView) && (
        <>
          <video
            className="media-fill"
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

          <VideoPlayToggle
            className="z-[2]"
            isPaused={isPaused}
            onToggle={toggle}
          />
        </>
      )}
    </div>
  );
}

BannerVideo.displayName = 'BannerVideo';
