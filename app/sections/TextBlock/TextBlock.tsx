import {Container, Link, Markdown} from '~/components';

import {Schema} from './TextBlock.schema';
import type {TextBlockCms} from './TextBlock.types';

export function TextBlock({cms}: {cms: TextBlockCms}) {
  const {buttons, heading, section, subtext} = cms;
  const maxWidthClass = section?.fullWidth
    ? 'max-w-none'
    : 'max-w-[var(--content-max-width)]';

  return (
    <Container container={cms.container}>
      <div
        className="px-contained py-contained"
        style={{color: section?.textColor}}
      >
        <div
          className={`mx-auto flex flex-col items-center gap-4 md:gap-6 ${maxWidthClass} text-center`}
        >
          {heading &&
            (section?.aboveTheFold ? (
              <h1 className="text-h2 mx-auto max-w-[46rem]">{heading}</h1>
            ) : (
              <h2 className="text-h2 mx-auto max-w-[46rem]">{heading}</h2>
            ))}

          {subtext && (
            <div className="mx-auto max-w-[46rem] [&_a]:underline [&_h1]:text-base [&_h2]:text-base [&_h3]:text-base [&_h4]:text-base [&_h5]:text-base [&_h6]:text-base [&_p]:text-base">
              <Markdown>{subtext}</Markdown>
            </div>
          )}

          {buttons?.length > 0 && (
            <ul className="flex flex-col justify-center gap-4 xs:flex-row">
              {buttons.slice(0, 2).map(({link, style}, index) => {
                return (
                  <li key={index}>
                    <Link
                      aria-label={link?.text}
                      className={style}
                      to={link?.url}
                      newTab={link?.newTab}
                      type={link?.type}
                    >
                      {link?.text}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </Container>
  );
}

TextBlock.displayName = 'TextBlock';
TextBlock.Schema = Schema;
