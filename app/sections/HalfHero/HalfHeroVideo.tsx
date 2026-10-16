// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable jsx-a11y/media-has-caption */
import {useState} from 'react';
import clsx from 'clsx';

import {getVideoSrcWithFirstFrame} from '~/lib/utils';
import {Image} from '~/components/Image';
import {Svg} from '~/components/Svg';
import {VideoPlayButton} from '~/components/VideoPlayButton';
import {usePlayWhileInView, useViewportBreakpoint} from '~/hooks';

import type {HalfHeroVideoProps} from './HalfHero.types';

export function HalfHeroVideo({
  aboveTheFold,
  autoplay,
  posterUrl,
  sound,
  video,
  videoAlt,
  viewport,
}: HalfHeroVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const breakpoint = useViewportBreakpoint();
  // Videos with sound use native controls, so only pause them out of view
  const {inViewRef, videoRef, hasBeenInView, isAutoplayBlocked, play} =
    usePlayWhileInView({
      shouldPlay: autoplay || (!sound && isPlaying),
    });

  // Mount only the copy for the current breakpoint; the other copy is hidden
  // with CSS and would otherwise still download and decode
  const shouldMountVideo = breakpoint === viewport && hasBeenInView;
  const isClickToPlay = !autoplay && !sound;
  const showPlayIcon = !isPlaying || isAutoplayBlocked;

  return (
    <div ref={inViewRef} className="media-fill relative">
      {shouldMountVideo ? (
        <video
          className="size-full object-cover"
          controls={!autoplay && sound}
          loop={autoplay || !sound}
          muted={autoplay || !sound}
          playsInline
          poster={posterUrl}
          preload={aboveTheFold && autoplay ? 'auto' : 'metadata'}
          ref={videoRef}
          key={video?.url}
        >
          {video?.url && (
            <source
              src={getVideoSrcWithFirstFrame(video.url)}
              type={video.format}
            />
          )}
        </video>
      ) : (
        posterUrl && (
          <Image
            data={{url: posterUrl}}
            className="size-full object-cover"
            loading={aboveTheFold ? 'eager' : 'lazy'}
            sizes="(min-width: 768px) 50vw, 100vw"
            withLoadingAnimation={false}
          />
        )
      )}

      {shouldMountVideo && isAutoplayBlocked && !isClickToPlay && (
        <VideoPlayButton
          label={`Play video for ${videoAlt}`}
          onPlay={play}
          position="corner"
        />
      )}

      {isClickToPlay && (
        <button
          aria-label={`Play video for ${videoAlt}`}
          className={clsx(
            'group absolute inset-0 size-full transition md:hover:bg-transparent',
            showPlayIcon && 'bg-[rgba(0,0,0,0.2)]',
          )}
          onClick={() => {
            // Call play() directly so it runs from the click's user gesture
            if (isAutoplayBlocked || !isPlaying) play();
            setIsPlaying(isAutoplayBlocked || !isPlaying);
          }}
          type="button"
        >
          {showPlayIcon && (
            <Svg
              className="absolute left-1/2 top-1/2 w-12 -translate-x-1/2 -translate-y-1/2 text-white opacity-90 transition xs:w-16 md:group-hover:opacity-100 lg:w-20"
              src="/svgs/play.svg#play"
              title="Play"
              viewBox="0 0 24 24"
            />
          )}
        </button>
      )}
    </div>
  );
}

HalfHeroVideo.displayName = 'HalfHeroVideo';
