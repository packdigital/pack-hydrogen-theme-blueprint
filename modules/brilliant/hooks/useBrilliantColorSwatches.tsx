import {useMemo} from 'react';

import {colorSwatches} from '../Product/colorSwatches.constants';

export function useBrilliantColorSwatches({colorName}: {colorName: string}) {
  const colorSwatch = useMemo(() => {
    //normalize name
    const colorKey = colorName
      .toLowerCase() // "yellow/blue"
      .replace(/[^a-z0-9]+/g, '-') // "yellow-blue"
      .replace(/(^-|-$)/g, '');
    return colorSwatches[colorKey];
  }, [colorName]);
  return {
    colorSwatch,
  };
}
