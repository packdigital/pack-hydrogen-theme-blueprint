import {Container} from '~/components/Container';

import type {HtmlCms} from './Html.types';
import {Schema} from './Html.schema';

export function Html({cms}: {cms: HtmlCms}) {
  const {content, html, section} = cms;
  return html ? (
    <Container container={cms.container}>
      <div
        className={`${section?.hasXPadding ? 'px-contained' : ''} ${
          section?.hasYPadding ? 'py-contained' : ''
        }`}
      >
        <div
          className={`mx-auto flex flex-col [&>:first-child]:mt-0 [&>:last-child]:mb-0 [&_a]:underline [&_h1]:mb-6 [&_h1]:text-center [&_h2]:mb-5 [&_h2]:mt-8 [&_h3]:mb-4 [&_h3]:mt-6 [&_h4]:my-4 [&_h5]:mb-4 [&_h5]:mt-2 [&_h6]:mb-4 [&_li>p]:mb-0 [&_li]:mb-2 [&_ol>li]:list-decimal [&_ol]:mb-4 [&_ol]:pl-8 [&_p]:mb-4 [&_table]:relative [&_table]:mb-4 [&_table]:w-full [&_table]:table-fixed [&_table]:border-collapse [&_table]:overflow-x-auto [&_table]:border [&_table]:border-border [&_td]:border [&_td]:border-border [&_td]:p-3 [&_td]:text-center [&_td]:align-top [&_th]:border [&_th]:border-border [&_th]:px-2 [&_th]:py-1.5 [&_thead]:bg-neutralLightest [&_ul>li]:list-disc [&_ul]:mb-4 [&_ul]:pl-8 ${content?.contentAlign} ${content?.textAlign} ${section?.maxWidth}`}
          dangerouslySetInnerHTML={{__html: html}}
          style={{
            color: section?.textColor,
          }}
        />
      </div>
    </Container>
  ) : null;
}

Html.displayName = 'Html';
Html.Schema = Schema;
