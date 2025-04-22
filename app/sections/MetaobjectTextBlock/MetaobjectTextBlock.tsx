import clsx from 'clsx';

import {Link} from '~/components/Link';
import {RichText} from '~/components/RichText';

import {Schema} from './MetaobjectTextBlock.schema';

export function MetaobjectTextBlock({cms}: {cms: Record<string, any>}) {
  const {
    button_link,
    button_link_text,
    heading,
    above_the_fold,
    subtext,
    full_width,
  } = cms;
  const maxWidthClass = full_width
    ? 'max-w-none'
    : 'max-w-[var(--content-max-width)]';

  return (
    <div
      className="px-contained py-contained"
      style={{backgroundColor: 'var(--background)', color: 'var(--text)'}}
    >
      <div
        className={clsx(
          'mx-auto flex flex-col items-center gap-4 md:gap-6',
          maxWidthClass,
          'text-center',
        )}
      >
        {heading &&
          (above_the_fold ? (
            <h1 className="text-h2 mx-auto max-w-[46rem]">{heading}</h1>
          ) : (
            <h2 className="text-h2 mx-auto max-w-[46rem]">{heading}</h2>
          ))}

        {subtext && (
          <RichText className="mx-auto max-w-[46rem]">{subtext}</RichText>
        )}

        {button_link && (
          <ul className="mt-4 flex flex-col justify-center gap-4 xs:flex-row">
            <li>
              <Link className="btn-primary" href={button_link} newTab={true}>
                {button_link_text}
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}

MetaobjectTextBlock.displayName = 'MetaobjectTextBlock';
MetaobjectTextBlock.Schema = Schema;
