import {useCallback, useEffect, useState} from 'react';

/*
 * NOTE: do not use match media to dictate the layout or visual elements between
 * breakpoints, as it will cause hydration errors or layout shift and flashing
 * of changing content with SSG upon hydration INSTEAD: use Tailwind breakpoint
 * styling to avoid layout shift with SSG
 */

/**
 * Returns a boolean indicating if the current viewport matches the media query
 * @param query - css media query
 * @returns boolean
 * @example
 * ```js
 * const isDesktopViewport = useMatchMedia('(min-width: 768px)');
 * ```
 */

function fallbackMatchMedia(query: string) {
  if (
    typeof document === 'undefined' ||
    typeof window.matchMedia !== 'function'
  ) {
    return undefined;
  }
  return window.matchMedia(query);
}

function omitMatchMediaResult(matchMediaResult: any) {
  if (!matchMediaResult) {
    return undefined;
  }
  return {media: matchMediaResult.media, matches: matchMediaResult.matches};
}

function useMedia(query: string) {
  const [mounted, setMounted] = useState(false);

  const [result, setResult] = useState(() => {
    return omitMatchMediaResult(fallbackMatchMedia(query));
  });

  const callback = useCallback((matchMediaResult: any) => {
    return setResult(omitMatchMediaResult(matchMediaResult));
  }, []);

  useEffect(() => {
    if (!query) return;
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!query) return;
    const matchMediaResult = fallbackMatchMedia(query);
    callback(matchMediaResult);
    if (matchMediaResult) {
      matchMediaResult.addEventListener('change', callback);
    }
    return () => {
      if (matchMediaResult) {
        matchMediaResult.removeEventListener('change', callback);
      }
    };
  }, [query]);

  if (!mounted) {
    return undefined;
  }

  return result;
}

export function useMatchMedia(query: string): boolean {
  const result = useMedia(query);
  return (result && result.matches) || false;
}
