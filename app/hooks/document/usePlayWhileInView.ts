import {useEffect, useRef, useState} from 'react';
import {useInView} from 'react-intersection-observer';

/**
 * Plays a video while it is near the viewport and pauses it otherwise.
 * `hasBeenInView` stays true after the first intersection, so callers can
 * defer mounting the video until it is needed and keep it mounted afterwards.
 * @param shouldPlay - whether the video should play while in view (e.g.
 * autoplay, active slide, or the user pressed play). When false the video is
 * paused on the next change, so playback started from native controls keeps
 * going until the video scrolls out of view.
 * @param rootMargin - intersection observer root margin
 * @returns `inViewRef` for the wrapper, `videoRef` callback ref for the
 * `<video>`, and `videoEl` for imperative play/pause
 * @example
 * ```js
 * const {inViewRef, videoRef, hasBeenInView} = usePlayWhileInView({
 *   shouldPlay: autoplay,
 * });
 * ```
 */

export function usePlayWhileInView({
  shouldPlay = true,
  rootMargin = '200px',
}: {
  shouldPlay?: boolean;
  rootMargin?: string;
} = {}) {
  // Element in state so the effect re-runs when the video mounts late
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const hasBeenInViewRef = useRef(false);
  const {ref: inViewRef, inView} = useInView({rootMargin});

  if (inView) hasBeenInViewRef.current = true;
  const hasBeenInView = hasBeenInViewRef.current;

  useEffect(() => {
    if (!videoEl) return;
    if (inView && shouldPlay) {
      // play() rejects if interrupted by pause() or blocked by the browser
      videoEl.play().catch(() => {});
    } else {
      videoEl.pause();
    }
  }, [inView, shouldPlay, videoEl]);

  return {inViewRef, videoRef: setVideoEl, videoEl, inView, hasBeenInView};
}
