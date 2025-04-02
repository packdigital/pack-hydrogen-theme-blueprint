import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import {useMemo} from 'react';

import {Schema} from './RichText.schema';

type RichTextCms = {richtext: string};

export function RichText({cms}: {cms: RichTextCms}) {
  const richtext = cms?.richtext || '';

  // Use useMemo to avoid unnecessary re-renders
  const content = useMemo(() => {
    if (!richtext) {
      return null;
    }

    try {
      // Only run DOMPurify in browser environments
      let sanitizedHtml = richtext;
      if (typeof window !== 'undefined') {
        sanitizedHtml = DOMPurify.sanitize(richtext, {
          USE_PROFILES: {html: true},
        });
      }

      // Parse the sanitized HTML into React components
      return parse(sanitizedHtml);
    } catch (error) {
      console.error('Error parsing rich text:', error);
      return richtext;
    }
  }, [richtext]);

  if (!content) {
    return null;
  }

  return (
    <div className="px-contained py-contained prose lg:prose-xl mx-auto">
      {content}
    </div>
  );
}

RichText.displayName = 'RichText';
RichText.Schema = Schema;
