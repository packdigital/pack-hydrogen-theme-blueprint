import {useMemo} from 'react';

import {useSettings} from '~/hooks';

/**
 * Generate a table of color swatches from the site settings
 * @returns map of color swatches
 * @example
 * ```js
 * const swatchesMap = useColorSwatches();
 * ```
 */

export function useColorSwatches(): Record<string, string> {
  const {product: productSettings} = useSettings();
  const {swatches} = {...productSettings?.colors};

  return useMemo(() => {
    if (!swatches?.length) return {};
    return swatches.reduce((acc, {name, color, image}) => {
      return {
        ...acc,
        [name?.toLowerCase().trim()]: image?.src || color,
      };
    }, {});
  }, [swatches]);
}
