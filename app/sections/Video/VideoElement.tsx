import {useRef, useState} from 'react';
import {useInView} from 'react-intersection-observer';
import clsx from 'clsx';

import {Svg} from '~/components/Svg';

import type {VideoElementProps} from './Video.types';

export function VideoElement({
  playOptions,
  posterUrl,
  title,
  video,
}: VideoElementProps) {
  const {autoplay, loop, pauseAndPlay, sound, controls} = {...playOptions};

  const videoRef = useRef<HTMLVideoElement>(null);
  const {ref: inViewRef, inView} = useInView({
    rootMargin: '200px',
    triggerOnce: true,
  });
  const [isPlaying, setIsPlaying] = useState(autoplay);

  return (
    <span className="group absolute inset-0 size-full" ref={inViewRef}>
      {inView && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
          aria-label={title}
          autoPlay={autoplay}
          className={clsx(
            'absolute inset-0 size-full object-cover',
            pauseAndPlay && 'cursor-pointer',
          )}
          controls={controls}
          loop={loop}
          muted={autoplay || !sound}
          onClick={() => {
            if (!pauseAndPlay || !videoRef.current) return;
            if (isPlaying) {
              videoRef.current.pause();
              setIsPlaying(false);
            } else {
              videoRef.current.play();
              setIsPlaying(true);
            }
          }}
          playsInline
          poster={posterUrl}
          ref={videoRef}
          key={video?.url}
        >
          {video?.url && <source src={video.url} type={video.format} />}
        </video>
      )}

      {pauseAndPlay && isPlaying && (
        <Svg
          className="pointer-events-none absolute left-1/2 top-1/2 w-10 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition md:group-hover:opacity-90"
          src="/svgs/pause.svg#pause"
          title="Pause"
          viewBox="0 0 24 24"
        />
      )}

      {pauseAndPlay && !isPlaying && (
        <Svg
          className="pointer-events-none absolute left-1/2 top-1/2 w-10 -translate-x-1/2 -translate-y-1/2 text-white opacity-70 transition md:group-hover:opacity-90"
          src="/svgs/play.svg#play"
          title="Play"
          viewBox="0 0 24 24"
        />
      )}
    </span>
  );
}

VideoElement.displayName = 'VideoElement';
