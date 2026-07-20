import {lazy, Suspense} from 'react';

import {Schema} from './Marquee.schema';
import type {MarqueeCms} from './Marquee.types';

const MarqueeBody = lazy(() =>
  import('./Marquee').then((module) => ({default: module.Marquee})),
);

export function Marquee({cms}: {cms: MarqueeCms}) {
  return (
    <Suspense fallback={null}>
      <MarqueeBody cms={cms} />
    </Suspense>
  );
}

Marquee.displayName = 'Marquee';
Marquee.Schema = Schema;
