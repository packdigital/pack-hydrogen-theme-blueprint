import {useMemo} from 'react';

import {Link, Markdown} from '~/components';

import type {HalfHeroContentProps} from './HalfHero.types';

export function HalfHeroContent({aboveTheFold, content}: HalfHeroContentProps) {
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
  const alignmentClasses = `${alignmentMobile} ${alignmentDesktop}`;

  const headingWithBreaks = useMemo(() => {
    const splitHeading = heading?.split('\n');
    if (splitHeading?.length === 1) return heading;
    return splitHeading?.reduce((acc: JSX.Element[], line, index, arr) => {
      acc.push(<span key={index}>{line}</span>);
      if (index < arr.length - 1) acc.push(<br key={`br${index}`} />);
      return acc;
    }, []);
  }, [heading]);

  return (
    <div className="px-contained py-contained w-full">
      <div
        className={`mx-auto flex flex-col gap-4 ${alignmentClasses} ${maxWidthDesktop}`}
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

        {subtext && (
          <div className="[&_a]:underline [&_h1]:text-base [&_h2]:text-base [&_h3]:text-base [&_h4]:text-base [&_h5]:text-base [&_h6]:text-base [&_p]:text-base">
            <Markdown>{subtext}</Markdown>
          </div>
        )}

        {buttons?.length > 0 && (
          <ul className="mt-4 flex flex-col justify-center gap-4 xs:flex-row">
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
  );
}

HalfHeroContent.displayName = 'HalfHeroContent';
