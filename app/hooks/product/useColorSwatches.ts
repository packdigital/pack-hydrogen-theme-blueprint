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
  const {swatchesGroups} = {...productSettings?.colors};

  return useMemo(() => {
    if (!swatchesGroups?.length) return {};
    return swatchesGroups.reduce((groupsAcc, {swatches}) => {
      if (!swatches?.length) return groupsAcc;
      const groupSwatches = swatches.reduce(
        (swatchesAcc, {name, color, image}) => {
          return {
            ...swatchesAcc,
            [name?.toLowerCase().trim()]: image?.src || color,
          };
        },
        {},
      );
      return {...groupsAcc, ...groupSwatches};
    }, {});
  }, [swatchesGroups]);
}
