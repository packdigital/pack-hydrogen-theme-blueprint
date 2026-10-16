import {useEffect, useState} from 'react';

// Matches Tailwind's `md` screen in tailwind.config.js
const DESKTOP_QUERY = '(min-width: 48rem)';

export type ViewportBreakpoint = 'mobile' | 'desktop';

/**
 * Returns the current breakpoint, or `undefined` until after hydration.
 * Use it to mount only the media a breakpoint needs (e.g. one of a mobile and
 * a desktop video), and keep SSR output breakpoint-agnostic until it resolves.
 * Layout and visual differences should still use Tailwind breakpoint classes.
 * @returns 'mobile' | 'desktop' | undefined
 * @example
 * ```js
 * const breakpoint = useViewportBreakpoint();
 * const shouldMountMobileVideo = breakpoint === 'mobile';
 * ```
 */

export function useViewportBreakpoint(): ViewportBreakpoint | undefined {
  const [breakpoint, setBreakpoint] = useState<ViewportBreakpoint>();

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      setBreakpoint('desktop');
      return;
    }
    const mediaQueryList = window.matchMedia(DESKTOP_QUERY);
    const update = () => {
      setBreakpoint(mediaQueryList.matches ? 'desktop' : 'mobile');
    };
    update();
    mediaQueryList.addEventListener('change', update);
    return () => {
      mediaQueryList.removeEventListener('change', update);
    };
  }, []);

  return breakpoint;
}
