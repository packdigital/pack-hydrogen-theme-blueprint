import {useEffect, useState} from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * True when the user has asked the OS to minimize motion. Use it to disable
 * JS-driven motion such as carousel autoplay or autoplaying video (WCAG
 * 2.2.2, 2.3.3). CSS animations are handled globally in app.css.
 */
export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(QUERY);
    setPrefersReducedMotion(mediaQuery.matches);
    const onChange = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  return prefersReducedMotion;
}
