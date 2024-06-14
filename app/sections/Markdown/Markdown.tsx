import {Container, Markdown as MarkdownComp} from '~/components';
import type {ContainerSettings} from '~/settings/container';

import {Schema} from './Markdown.schema';

interface MarkdownCms {
  centerAllText: boolean;
  content: string;
  section: {
    maxWidth: string;
    textColor: string;
  };
  container: ContainerSettings;
}

export function Markdown({cms}: {cms: MarkdownCms}) {
  const {centerAllText, content, section} = cms;

  return (
    <Container container={cms.container}>
      <div className="px-contained py-contained">
        <div
          className={`mx-auto ${section?.maxWidth}`}
          style={{
            color: section?.textColor,
          }}
        >
          <MarkdownComp centerAllText={centerAllText}>{content}</MarkdownComp>
        </div>
      </div>
    </Container>
  );
}

Markdown.displayName = 'Markdown';
Markdown.Schema = Schema;
