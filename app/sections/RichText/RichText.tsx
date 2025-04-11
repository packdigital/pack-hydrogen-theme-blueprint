import {Container} from '~/components/Container';
import {RichText as RichTextComp} from '~/components/RichText';

import {Schema} from './RichText.schema';
import type {RichTextCms} from './RichText.types';

export function RichText({cms}: {cms: RichTextCms}) {
  const {richtext = '', section} = cms;

  return (
    <Container container={cms.container}>
      <div
        className={`${section?.hasXPadding ? 'px-contained' : ''} ${
          section?.hasYPadding ? 'py-contained' : ''
        }`}
      >
        <div
          className={`mx-auto ${section?.maxWidth || ''}`}
          style={{color: section?.textColor}}
        >
          <RichTextComp>{richtext}</RichTextComp>
        </div>
      </div>
    </Container>
  );
}

RichText.displayName = 'RichText';
RichText.Schema = Schema;
