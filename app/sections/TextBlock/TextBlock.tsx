import clsx from 'clsx';

import {Container} from '~/components/Container';
import {Link} from '~/components/Link';
import {RichText} from '~/components/RichText';

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
          className={clsx(
            'mx-auto flex flex-col items-center gap-4 md:gap-6',
            maxWidthClass,
            'text-center',
          )}
        >
          {heading &&
            (section?.aboveTheFold ? (
              <h1 className="text-h2 mx-auto max-w-[46rem]">{heading}</h1>
            ) : (
              <h2 className="text-h2 mx-auto max-w-[46rem]">{heading}</h2>
            ))}

          {subtext && (
            <RichText className="mx-auto max-w-[46rem]">{subtext}</RichText>
          )}

          {buttons?.length > 0 && (
            <ul className="flex flex-col justify-center gap-4 xs:flex-row">
              {buttons.slice(0, 2).map(({link, style}, index) => {
                return (
                  <li key={index}>
                    <Link
                      aria-label={link?.text}
                      className={clsx(style)}
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
