import {useEffect} from 'react';

/**
 * Sets the `--viewport-height` CSS variable to the current viewport height
 * @example
 * ```js
 * useSetViewportHeightCssVar();
 * ```
 */

export function useSetViewportHeightCssVar() {
  useEffect(() => {
    const setViewportHeight = () => {
      const viewportHeight = `${window.innerHeight}px`;
      document.documentElement.style.setProperty(
        '--viewport-height',
        viewportHeight,
      );
    };

    window.addEventListener('resize', setViewportHeight);
    setViewportHeight();

    return () => {
      window.removeEventListener('resize', setViewportHeight);
    };
  }, []);
}
