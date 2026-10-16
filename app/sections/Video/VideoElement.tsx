import {useState} from 'react';
import clsx from 'clsx';

import {Image} from '~/components/Image';
import {Svg} from '~/components/Svg';
import {usePlayWhileInView, useViewportBreakpoint} from '~/hooks';

import type {VideoElementProps} from './Video.types';

export function VideoElement({
  playOptions,
  posterUrl,
  title,
  video,
  viewport,
}: VideoElementProps) {
  const {autoplay, loop, pauseAndPlay, sound, controls} = {...playOptions};

  const [isPlaying, setIsPlaying] = useState(autoplay);

  const breakpoint = useViewportBreakpoint();
  const {inViewRef, videoRef, hasBeenInView} = usePlayWhileInView({
    shouldPlay: isPlaying,
  });

  // Mount only the copy for the current breakpoint; the other copy is hidden
  // with CSS and would otherwise still download and decode
  const shouldMountVideo = breakpoint === viewport && hasBeenInView;

  return (
    <span className="group absolute inset-0 size-full" ref={inViewRef}>
      {shouldMountVideo ? (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
          aria-label={title}
          className={clsx(
            'absolute inset-0 size-full object-cover',
            pauseAndPlay && 'cursor-pointer',
          )}
          controls={controls}
          loop={loop}
          muted={autoplay || !sound}
          onClick={() => {
            if (!pauseAndPlay) return;
            setIsPlaying(!isPlaying);
          }}
          playsInline
          poster={posterUrl}
          preload="metadata"
          ref={videoRef}
          key={video?.url}
        >
          {video?.url && <source src={video.url} type={video.format} />}
        </video>
      ) : (
        posterUrl && (
          <Image
            data={{url: posterUrl, altText: title}}
            className="absolute inset-0 size-full object-cover"
            loading="lazy"
            sizes="100vw"
            withLoadingAnimation={false}
          />
        )
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
