import {useMemo} from 'react';

import {Link} from '~/components';

import type {BannerContentProps} from './Banner.types';

export function BannerContent({
  aboveTheFold = true,
  content,
  text,
}: BannerContentProps) {
  const {buttons, color, heading, subheading} = {...text};
  const {
    alignmentMobile,
    alignmentDesktop,
    darkOverlay,
    maxWidthMobile,
    maxWidthDesktop,
    positionMobile,
    positionDesktop,
  } = {
    ...content,
  };
  const alignmentClasses = `${alignmentMobile} ${alignmentDesktop}`;
  const positionClasses = `${positionMobile} ${positionDesktop}`;
  const maxWidthContentClasses = `${maxWidthMobile} ${maxWidthDesktop}`;
  const darkOverlayClass = darkOverlay ? 'bg-[rgba(0,0,0,0.2)]' : '';

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
    <div
      className={`pointer-events-none relative flex size-full p-4 md:p-8 xl:p-12 ${positionClasses} ${darkOverlayClass}`}
    >
      <div
        className={`pointer-events-auto flex flex-col gap-6 ${alignmentClasses} ${maxWidthContentClasses}`}
        style={{color}}
      >
        <div>
          {headingWithBreaks && (
            <>
              {aboveTheFold ? (
                <h1 className="text-h1">{headingWithBreaks}</h1>
              ) : (
                <h2 className="text-h1">{headingWithBreaks}</h2>
              )}
            </>
          )}

          {subheading && <p>{subheading}</p>}
        </div>

        {buttons?.length > 0 && (
          <ul className={`flex flex-col justify-center gap-4 xs:flex-row`}>
            {buttons?.slice(0, 2).map(({link, style}, index) => {
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

BannerContent.displayName = 'BannerContent';
