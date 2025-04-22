import {useMemo} from 'react';
import clsx from 'clsx';

import {Link} from '~/components/Link';
import {RichText} from '~/components/RichText';

import type {HalfHeroContentProps} from './HalfHero.types';

export function HalfHeroContent({
  aboveTheFold,
  content,
  fullBleed,
  mediaOrderDesktop,
}: HalfHeroContentProps) {
  const {
    alignmentDesktop,
    alignmentMobile,
    buttons,
    color,
    heading,
    maxWidthDesktop,
    subtext,
    superheading,
  } = {...content};

  const headingWithBreaks = useMemo(() => {
    const splitHeading = heading?.split('\n');
    if (splitHeading?.length === 1) return heading;
    return splitHeading?.reduce(
      (acc: React.JSX.Element[], line, index, arr) => {
        acc.push(<span key={index}>{line}</span>);
        if (index < arr.length - 1) acc.push(<br key={`br${index}`} />);
        return acc;
      },
      [],
    );
  }, [heading]);

  return (
    <div
      className={clsx(
        'px-contained py-contained w-full',
        fullBleed ? '' : mediaOrderDesktop === '2' ? 'md:!pl-0' : 'md:!pr-0',
      )}
    >
      <div
        className={clsx(
          'mx-auto flex flex-col gap-4',
          alignmentMobile,
          alignmentDesktop,
          maxWidthDesktop,
        )}
        style={{color}}
      >
        <div>
          {superheading && (
            <p className="text-superheading mb-1 lg:mb-1.5">{superheading}</p>
          )}

          {aboveTheFold ? (
            <h1 className="text-h2">{headingWithBreaks}</h1>
          ) : (
            <h2 className="text-h2">{headingWithBreaks}</h2>
          )}
        </div>

        {subtext && <RichText>{subtext}</RichText>}

        {buttons && buttons.length > 0 && (
          <ul className="mt-4 flex flex-col justify-center gap-4 xs:flex-row">
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
  );
}

HalfHeroContent.displayName = 'HalfHeroContent';
