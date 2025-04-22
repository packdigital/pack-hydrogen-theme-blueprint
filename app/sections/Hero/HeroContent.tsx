import {useMemo} from 'react';
import clsx from 'clsx';

import {Link} from '~/components/Link';

import type {HeroSlideProps} from './Hero.types';

export function HeroContent({
  aboveTheFold,
  index,
  isActiveSlide,
  isFirstSlide,
  sectionId,
  slide,
}: HeroSlideProps) {
  const {button, content, text} = slide;
  const {
    colorDesktop,
    colorMobile,
    heading,
    hideHeadingDesktop,
    hideHeadingMobile,
    subheading,
    superheading,
  } = {...text};
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
  const hiddenHeadingMobileClass =
    'max-md:absolute max-md:z-[-1] max-md:opacity-0 max-md:pointer-events-none';
  const hiddenHeadingDesktopClass =
    'md:absolute md:z-[-1] md:opacity-0 md:pointer-events-none';
  const hiddenHeadingClasses = `${
    hideHeadingMobile ? hiddenHeadingMobileClass : ''
  } ${hideHeadingDesktop ? hiddenHeadingDesktopClass : ''}`;
  const hiddenButtonClasses = `${
    button?.hideButtonsMobile ? 'max-md:hidden' : ''
  } ${button?.hideButtonsDesktop ? 'md:hidden' : ''}`;

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

  const heroTextColorClass = `theme-hero-text-${sectionId}-${index}`;

  return (
    <div
      className={clsx(
        'absolute inset-0 flex size-full p-4 md:p-8 xl:p-12',
        positionClasses,
        darkOverlayClass,
      )}
    >
      <style>
        {`.${heroTextColorClass} {
            @media (max-width: 767px) {
              color: ${colorMobile};
            }
            @media (min-width: 768px) {
              color: ${colorDesktop};
            }
          }
        `}
      </style>

      <div
        className={clsx(
          'relative flex flex-col gap-6',
          alignmentClasses,
          maxWidthContentClasses,
        )}
      >
        <div className={clsx(heroTextColorClass, hiddenHeadingClasses)}>
          {superheading && (
            <p className="text-superheading max-lg:mb-1">{superheading}</p>
          )}

          {aboveTheFold && isFirstSlide ? (
            <h1 className="text-h1">{headingWithBreaks}</h1>
          ) : (
            <h2 className="text-h1">{headingWithBreaks}</h2>
          )}

          {subheading && <p className="mt-4">{subheading}</p>}
        </div>

        {button?.buttons?.length > 0 && (
          <ul
            className={clsx(
              'flex flex-col justify-center gap-4 xs:flex-row',
              hiddenButtonClasses,
            )}
          >
            {button?.buttons?.slice(0, 2).map(({link, style}, index) => {
              return (
                <li key={index}>
                  <Link
                    aria-label={link?.text}
                    className={clsx(style)}
                    to={button.clickableSlide ? null : link?.url}
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

      {isActiveSlide && button?.clickableSlide && (
        <Link
          aria-label={button.buttons?.[0]?.link?.text}
          className="pointer-events-auto absolute inset-0 z-[1] size-full"
          to={button.buttons?.[0]?.link?.url}
          type={button.buttons?.[0]?.link?.type}
        />
      )}
    </div>
  );
}

HeroContent.displayName = 'HeroContent';
