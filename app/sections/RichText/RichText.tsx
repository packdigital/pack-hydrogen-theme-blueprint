import {Schema} from './RichText.schema';

type RichTextCms = {richtext: string};

export function RichText({cms}: {cms: RichTextCms}) {
  const richtext = cms?.richtext || '';

  if (!richtext) {
    return null;
  }

  return (
    <div
      className="px-contained py-contained prose lg:prose-xl mx-auto"
      dangerouslySetInnerHTML={{__html: richtext}}
    />
  );
}

RichText.displayName = 'RichText';
RichText.Schema = Schema;
