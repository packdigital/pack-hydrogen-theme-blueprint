import {forwardRef} from 'react';
import ReactMarkdown, {defaultUrlTransform} from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import clsx from 'clsx';
import type {Components} from 'react-markdown';

interface MarkdownProps {
  centerAllText?: boolean;
  children: string | null | undefined;
  components?: Components;
}

export const Markdown = forwardRef(
  (
    {centerAllText, children, components = {}}: MarkdownProps,
    ref: React.Ref<HTMLDivElement> | undefined,
  ) => {
    const centerTextClass = centerAllText ? 'text-center' : '';

    const urlTransform = (url: string) => {
      if (url.startsWith('tel:') || url.startsWith('sms:')) {
        return url;
      }
      return defaultUrlTransform(url);
    };

    return (
      <div
        ref={ref}
        className={clsx(
          'text-center [&>:first-child]:mt-0 [&>:last-child]:mb-0 [&_a]:underline [&_h1]:mb-6 [&_h1]:text-center [&_h2]:mb-5 [&_h2]:mt-8 [&_h3]:mb-4 [&_h3]:mt-6 [&_h4]:my-4 [&_h5]:mb-4 [&_h5]:mt-2 [&_h6]:mb-4 [&_li>p]:mb-0 [&_li]:mb-2 [&_ol>li]:list-decimal [&_ol]:mb-4 [&_ol]:pl-8 [&_p]:mb-4 [&_table]:relative [&_table]:mb-4 [&_table]:w-full [&_table]:table-fixed [&_table]:border-collapse [&_table]:overflow-x-auto [&_table]:border [&_table]:border-border [&_td]:border [&_td]:border-border [&_td]:p-3 [&_td]:text-center [&_td]:align-top [&_th]:border [&_th]:border-border [&_th]:px-2 [&_th]:py-1.5 [&_thead]:bg-neutralLightest [&_ul>li]:list-disc [&_ul]:mb-4 [&_ul]:pl-8',
          centerTextClass,
        )}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          urlTransform={urlTransform}
          components={components}
        >
          {children}
        </ReactMarkdown>
      </div>
    );
  },
);

Markdown.displayName = 'Markdown';
