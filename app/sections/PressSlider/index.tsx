import {lazy, Suspense} from 'react';

import {Schema} from './PressSlider.schema';
import type {PressSliderCms} from './PressSlider.types';

const PressSliderBody = lazy(() =>
  import('./PressSlider').then((module) => ({default: module.PressSlider})),
);

export function PressSlider({cms}: {cms: PressSliderCms}) {
  return (
    <Suspense fallback={null}>
      <PressSliderBody cms={cms} />
    </Suspense>
  );
}

PressSlider.displayName = 'PressSlider';
PressSlider.Schema = Schema;
