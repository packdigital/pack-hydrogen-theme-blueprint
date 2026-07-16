import {lazy, Suspense} from 'react';

import {Schema} from './ShoppableSocialVideo.schema';
import type {ShoppableSocialVideoCms} from './ShoppableSocialVideo.types';

export {SHOPPABLE_SOCIAL_VIDEO_SECTION_KEY} from './ShoppableSocialVideo.schema';

const ShoppableSocialVideoBody = lazy(() =>
  import('./ShoppableSocialVideo').then((module) => ({
    default: module.ShoppableSocialVideo,
  })),
);

export function ShoppableSocialVideo({cms}: {cms: ShoppableSocialVideoCms}) {
  return (
    <Suspense fallback={null}>
      <ShoppableSocialVideoBody cms={cms} />
    </Suspense>
  );
}

ShoppableSocialVideo.displayName = 'ShoppableSocialVideo';
ShoppableSocialVideo.Schema = Schema;
