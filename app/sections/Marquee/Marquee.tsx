import {useState} from 'react';
import MarqueeComp from 'react-fast-marquee';
import clsx from 'clsx';

import {Container} from '~/components/Container';
import {RichText} from '~/components/RichText';
import {Svg} from '~/components/Svg';
import {usePrefersReducedMotion} from '~/hooks';

import {Schema} from './Marquee.schema';
import type {MarqueeCms} from './Marquee.types';

export function Marquee({cms}: {cms: MarqueeCms}) {
  const {contentItems, content, marquee, section} = cms;
  const prefersReducedMotion = usePrefersReducedMotion();
  const [userPaused, setUserPaused] = useState(false);
  const isPaused = userPaused || prefersReducedMotion;
  const {
    font = 'font-sans',
    uppercase,
    fontSizeDesktop = 'lg:text-[24px]',
    fontSizeTablet = 'md:text-[20px]',
    fontSizeMobile = 'text-[16px]',
    letterSpacing = 'tracking-normal',
    yPaddingDesktop = 'lg:py-[16px]',
    yPaddingTablet = 'md:py-[12px]',
    yPaddingMobile = 'py-[8px]',
    spacing = 'pl-[48px]',
  } = {...content};

  return (
    <Container container={cms.container}>
      <div
        className={clsx('relative', section?.hasYPadding ? 'py-contained' : '')}
      >
        <MarqueeComp
          play={!isPaused}
          autoFill
          direction={marquee?.direction || 'left'}
          gradient={!!marquee?.enabledGradient}
          gradientColor={content?.bgColor}
          gradientWidth={marquee?.gradientWidth || 100}
          pauseOnHover={!!marquee?.pauseOnHover}
          pauseOnClick={!!marquee?.pauseOnClick}
          speed={marquee?.speed || 50}
          style={{backgroundColor: content?.bgColor, color: content?.textColor}}
        >
          {contentItems?.map((item, index) => {
            return (
              <RichText
                key={index}
                className={clsx(
                  font,
                  fontSizeMobile,
                  fontSizeTablet,
                  fontSizeDesktop,
                  letterSpacing,
                  spacing,
                  uppercase ? 'uppercase' : '',
                  yPaddingMobile,
                  yPaddingTablet,
                  yPaddingDesktop,
                )}
              >
                {item.text}
              </RichText>
            );
          })}
        </MarqueeComp>

        {/* Moving content needs a pause control (WCAG 2.2.2) */}
        <button
          aria-label={isPaused ? 'Play scrolling text' : 'Pause scrolling text'}
          className="absolute right-2 top-1/2 z-[1] flex size-6 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black"
          onClick={() => setUserPaused(!isPaused)}
          type="button"
        >
          <Svg
            className="w-2.5 text-current"
            src={isPaused ? '/svgs/play.svg#play' : '/svgs/pause.svg#pause'}
            viewBox="0 0 24 24"
          />
        </button>
      </div>
    </Container>
  );
}

Marquee.displayName = 'Marquee';
Marquee.Schema = Schema;
