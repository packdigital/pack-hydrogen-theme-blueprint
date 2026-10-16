import {useCallback, useEffect, useRef, useState} from 'react';
import {useInView} from 'react-intersection-observer';

/**
 * Plays a video while it is near the viewport and pauses it otherwise.
 * `hasBeenInView` stays true after the first intersection, so callers can
 * defer mounting the video until it is needed and keep it mounted afterwards.
 *
 * If the browser refuses to autoplay (power saving, data saver, autoplay
 * policy), `isAutoplayBlocked` becomes true so the caller can show a play
 * button; calling `play` from that button's click handler starts playback from
 * a user gesture. A pause the hook did not make (custom button or native
 * controls, but not the end of playback) counts as the visitor's, and the
 * video is not auto-resumed until it is played again. The `<video>` is held in
 * state via a callback ref, so a late-mounted or re-keyed element is picked up
 * and its listeners are rebound.
 * @param shouldPlay - whether the video should play while in view (e.g.
 * autoplay, active slide, or the user pressed play). When false the video is
 * paused on the next change, so playback started from native controls keeps
 * going until the video scrolls out of view.
 * @param rootMargin - intersection observer root margin
 * @returns `inViewRef` for the wrapper, `videoRef` callback ref for the
 * `<video>`, `isAutoplayBlocked`, and `play` for user-initiated playback
 * @example
 * ```js
 * const {inViewRef, videoRef, hasBeenInView, isAutoplayBlocked, play} =
 *   usePlayWhileInView({shouldPlay: autoplay});
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
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState(false);
  const hasBeenInViewRef = useRef(false);
  const isPausingRef = useRef(false);
  const isManuallyPausedRef = useRef(false);
  const {ref: inViewRef, inView} = useInView({rootMargin});

  if (inView) hasBeenInViewRef.current = true;
  const hasBeenInView = hasBeenInViewRef.current;

  useEffect(() => {
    if (!videoEl) return undefined;
    isManuallyPausedRef.current = false;
    setIsAutoplayBlocked(false);
    const handlePlay = () => {
      isManuallyPausedRef.current = false;
    };
    const handlePlaying = () => {
      isManuallyPausedRef.current = false;
      setIsAutoplayBlocked(false);
    };
    const handlePause = () => {
      // Ignore the hook's own pauses and the pause fired when playback ends
      if (isPausingRef.current) {
        isPausingRef.current = false;
        return;
      }
      if (videoEl.ended) return;
      isManuallyPausedRef.current = true;
    };
    videoEl.addEventListener('play', handlePlay);
    videoEl.addEventListener('playing', handlePlaying);
    videoEl.addEventListener('pause', handlePause);
    return () => {
      videoEl.removeEventListener('play', handlePlay);
      videoEl.removeEventListener('playing', handlePlaying);
      videoEl.removeEventListener('pause', handlePause);
    };
  }, [videoEl]);

  useEffect(() => {
    if (!videoEl) return;
    if (inView && shouldPlay && !isManuallyPausedRef.current) {
      videoEl.play().catch((error: DOMException) => {
        // AbortError means a pause() interrupted play(), not a refusal
        if (error?.name !== 'AbortError') setIsAutoplayBlocked(true);
      });
    } else if (!videoEl.paused) {
      isPausingRef.current = true;
      videoEl.pause();
    }
  }, [inView, shouldPlay, videoEl]);

  // Call from a click handler so playback starts from a user gesture
  const play = useCallback(() => {
    if (!videoEl) return;
    isManuallyPausedRef.current = false;
    videoEl.play().catch(() => {});
  }, [videoEl]);

  return {
    inViewRef,
    videoRef: setVideoEl,
    videoEl,
    inView,
    hasBeenInView,
    isAutoplayBlocked,
    play,
  };
}
