import {useCallback, useRef} from 'react';

/**
 * Lock document body's scroll by setting position to fixed
 * @returns function to lock and function to unlock body scroll
 * @example
 * ```js
 * const {lockBodyScroll, unlockBodyScroll} = useBodyScrollLock();
 * ```
 */

export function useBodyScrollLock(): {
  lockBodyScroll: () => void;
  unlockBodyScroll: () => void;
} {
  const scrollY = useRef(0);

  const lockBodyScroll = useCallback(() => {
    try {
      scrollY.current = window.scrollY;
      document.body.style.top = `-${scrollY.current}px`;
      document.body.style.position = 'fixed';
    } catch (error) {
      console.error(error);
    }
  }, []);

  const unlockBodyScroll = useCallback(() => {
    try {
      document.body.style.removeProperty('top');
      document.body.style.removeProperty('position');
      window.scrollTo({
        top: scrollY.current,
        left: 0,
        behavior: 'instant',
      });
      scrollY.current = 0;
    } catch (error) {
      console.error(error);
    }
  }, []);

  return {lockBodyScroll, unlockBodyScroll};
}
