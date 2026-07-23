import {lazy, Suspense} from 'react';

import {Schema} from './Markdown.schema';
import type {MarkdownCms} from './Markdown.types';

const MarkdownBody = lazy(() =>
  import('./Markdown').then((module) => ({default: module.Markdown})),
);

export function Markdown({cms}: {cms: MarkdownCms}) {
  return (
    <Suspense fallback={null}>
      <MarkdownBody cms={cms} />
    </Suspense>
  );
}

Markdown.displayName = 'Markdown';
Markdown.Schema = Schema;
