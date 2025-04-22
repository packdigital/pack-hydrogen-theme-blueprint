import clsx from 'clsx';

import {Container} from '~/components/Container';
import {Markdown as MarkdownComp} from '~/components/Markdown';

import {Schema} from './Markdown.schema';
import type {MarkdownCms} from './Markdown.types';

export function Markdown({cms}: {cms: MarkdownCms}) {
  const {content, section} = cms;

  return (
    <Container container={cms.container}>
      <div
        className={clsx(
          section?.hasXPadding && 'px-contained',
          section?.hasYPadding && 'py-contained',
        )}
      >
        <div
          className={clsx('mx-auto', section?.maxWidth)}
          style={{
            color: section?.textColor,
          }}
        >
          <MarkdownComp centerAllText={section?.centerAllText}>
            {content}
          </MarkdownComp>
        </div>
      </div>
    </Container>
  );
}

Markdown.displayName = 'Markdown';
Markdown.Schema = Schema;
