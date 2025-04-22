import MarqueeComp from 'react-fast-marquee';
import clsx from 'clsx';

import {Container} from '~/components/Container';
import {RichText} from '~/components/RichText';

import {Schema} from './Marquee.schema';
import type {MarqueeCms} from './Marquee.types';

export function Marquee({cms}: {cms: MarqueeCms}) {
  const {contentItems, content, marquee, section} = cms;
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
      <div className={clsx(section?.hasYPadding ? 'py-contained' : '')}>
        <MarqueeComp
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
      </div>
    </Container>
  );
}

Marquee.displayName = 'Marquee';
Marquee.Schema = Schema;
