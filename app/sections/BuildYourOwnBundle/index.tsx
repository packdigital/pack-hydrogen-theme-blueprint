import {lazy, Suspense} from 'react';

import {Schema} from './BuildYourOwnBundle.schema';
import type {BuildYourOwnBundleCms} from './BuildYourOwnBundle.types';

const BuildYourOwnBundleBody = lazy(() =>
  import('./BuildYourOwnBundle').then((module) => ({
    default: module.BuildYourOwnBundle,
  })),
);

export function BuildYourOwnBundle({cms}: {cms: BuildYourOwnBundleCms}) {
  return (
    <Suspense fallback={null}>
      <BuildYourOwnBundleBody cms={cms} />
    </Suspense>
  );
}

BuildYourOwnBundle.displayName = 'BuildYourOwnBundle';
BuildYourOwnBundle.Schema = Schema;
