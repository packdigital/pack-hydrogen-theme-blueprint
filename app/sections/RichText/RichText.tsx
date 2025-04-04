import {useEffect, useState} from 'react';

import {Schema} from './RichText.schema';

type RichTextCms = {richtext: string};

export function RichText({cms}: {cms: RichTextCms}) {
  const richtext = cms?.richtext || '';
  const [sanitizedHtml, setSanitizedHtml] = useState(richtext);

  // Client-side only sanitization
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('dompurify').then((DOMPurify) => {
        const clean = DOMPurify.default.sanitize(richtext, {
          USE_PROFILES: {html: true},
        });
        setSanitizedHtml(clean);
      });
    }
  }, [richtext]);

  if (!richtext) {
    return null;
  }

  return (
    <div
      className="px-contained py-contained prose lg:prose-xl mx-auto"
      dangerouslySetInnerHTML={{__html: sanitizedHtml}}
    />
  );
}

RichText.displayName = 'RichText';
RichText.Schema = Schema;
