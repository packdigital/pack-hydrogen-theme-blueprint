import {useCallback, useEffect, useRef, useState} from 'react';

import {usePrefersReducedMotion} from './usePrefersReducedMotion';

/**
 * Gives an autoplaying/looping <video> a user-controllable pause (WCAG
 * 2.2.2). A user pause is sticky: if other code later calls video.play()
 * (e.g. on scroll into view), it is paused again. Videos start paused when
 * the user prefers reduced motion.
 *
 * @example
 * const {videoRef, isPaused, toggle} = useVideoPauseControl();
 * <video ref={videoRef} autoPlay loop muted />
 * <VideoPlayToggle isPaused={isPaused} onToggle={toggle} />
 */
export function useVideoPauseControl() {
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const userPausedRef = useRef(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!video) return undefined;
    const onPlay = () => {
      if (userPausedRef.current) {
        video.pause();
        return;
      }
      setIsPaused(false);
    };
    const onPause = () => setIsPaused(true);
    setIsPaused(video.paused && !video.autoplay);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
    };
  }, [video]);

  useEffect(() => {
    if (!video || !prefersReducedMotion) return;
    userPausedRef.current = true;
    video.pause();
    setIsPaused(true);
  }, [video, prefersReducedMotion]);

  const toggle = useCallback(() => {
    if (!video) return;
    if (video.paused) {
      userPausedRef.current = false;
      video.play().catch(() => {});
    } else {
      userPausedRef.current = true;
      video.pause();
    }
  }, [video]);

  return {video, videoRef: setVideo, isPaused, toggle};
}
