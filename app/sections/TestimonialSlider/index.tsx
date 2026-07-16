import {lazy, Suspense} from 'react';

import {Schema} from './TestimonialSlider.schema';
import type {TestimonialSliderCms} from './TestimonialSlider.types';

const TestimonialSliderBody = lazy(() =>
  import('./TestimonialSlider').then((module) => ({
    default: module.TestimonialSlider,
  })),
);

export function TestimonialSlider({cms}: {cms: TestimonialSliderCms}) {
  return (
    <Suspense fallback={null}>
      <TestimonialSliderBody cms={cms} />
    </Suspense>
  );
}

TestimonialSlider.displayName = 'TestimonialSlider';
TestimonialSlider.Schema = Schema;
