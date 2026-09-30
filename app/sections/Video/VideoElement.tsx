import {useInView} from 'react-intersection-observer';
import clsx from 'clsx';

import {Svg} from '~/components/Svg';
import {VideoPlayToggle} from '~/components/VideoPlayToggle';
import {useVideoPauseControl} from '~/hooks';

import type {VideoElementProps} from './Video.types';

export function VideoElement({
  insideLink = false,
  playOptions,
  posterUrl,
  title,
  video,
}: VideoElementProps & {insideLink?: boolean}) {
  const {autoplay, loop, pauseAndPlay, sound, controls} = {...playOptions};

  const {videoRef, isPaused, toggle} = useVideoPauseControl();
  const {ref: inViewRef, inView} = useInView({
    rootMargin: '200px',
    triggerOnce: true,
  });

  // Autoplaying video with no native controls still needs a pause control
  // (WCAG 2.2.2). A button can't be nested in a link, so a linked video
  // relies on the merchant enabling "Pause and play" or controls instead.
  const showPauseToggle = autoplay && !controls && !pauseAndPlay && !insideLink;

  return (
    <span className="group absolute inset-0 size-full" ref={inViewRef}>
      {inView && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
          aria-label={title}
          autoPlay={autoplay}
          className="absolute inset-0 size-full object-cover"
          controls={controls}
          loop={loop}
          muted={autoplay || !sound}
          playsInline
          poster={posterUrl}
          ref={videoRef}
          key={video?.url}
        >
          {video?.url && <source src={video.url} type={video.format} />}
        </video>
      )}

      {inView && pauseAndPlay && (
        // Whole-video button: keyboard operable, unlike a click on <video>
        <button
          aria-label={
            isPaused ? `Play ${title || 'video'}` : `Pause ${title || 'video'}`
          }
          className="group/btn absolute inset-0 size-full cursor-pointer"
          onClick={toggle}
          type="button"
        >
          <Svg
            className={clsx(
              'pointer-events-none absolute left-1/2 top-1/2 w-10 -translate-x-1/2 -translate-y-1/2 text-white transition md:group-hover:opacity-90',
              isPaused
                ? 'opacity-70'
                : 'opacity-0 group-focus-visible/btn:opacity-90',
            )}
            src={isPaused ? '/svgs/play.svg#play' : '/svgs/pause.svg#pause'}
            viewBox="0 0 24 24"
          />
        </button>
      )}

      {inView && showPauseToggle && (
        <VideoPlayToggle isPaused={isPaused} onToggle={toggle} />
      )}
    </span>
  );
}

VideoElement.displayName = 'VideoElement';
