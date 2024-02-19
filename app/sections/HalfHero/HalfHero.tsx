import {Container} from '~/components';

import {HalfHeroContent} from './HalfHeroContent';
import {HalfHeroMedia} from './HalfHeroMedia';
import type {HalfHeroCms} from './HalfHero.types';
import {Schema} from './HalfHero.schema';

export function HalfHero({cms}: {cms: HalfHeroCms}) {
  const {section, content, media} = cms;
  const {
    aspectDesktop = 'md:before:pb-[100%]',
    aspectMobile = 'max-md:before:pb-[100%]',
    fill,
    mediaOrderDesktop,
    mediaOrderMobile,
  } = {
    ...media,
  };

  const maxWidthContainerClass = section?.fullWidth
    ? 'max-w-none'
    : 'max-w-[var(--content-max-width)]';
  const fillClass = fill ? 'h-full' : `md:before:float-left ${aspectDesktop}`;
  const mediaOrderClasses = `${
    mediaOrderMobile === '2' ? 'order-2' : 'order-1'
  } ${mediaOrderDesktop === '2' ? 'md:order-2' : 'md:order-1'}`;
  const contentOrderClasses = `${
    mediaOrderMobile === '2' ? 'order-1' : 'order-2'
  } ${mediaOrderDesktop === '2' ? 'md:order-1' : 'md:order-2'}`;

  return (
    <Container container={cms.container}>
      <div
        className={`${section?.fullBleed ? '' : 'px-contained'} ${
          section?.verticalPadding ? 'py-contained' : ''
        }`}
      >
        <div
          className={`relative mx-auto grid grid-cols-1 items-center md:grid-cols-2 ${maxWidthContainerClass}`}
        >
          <div
            className={`relative w-full bg-offWhite max-md:before:float-left ${aspectMobile} ${fillClass} ${mediaOrderClasses}`}
          >
            <HalfHeroMedia
              aboveTheFold={section?.aboveTheFold}
              aspectDesktop={aspectDesktop}
              aspectMobile={aspectMobile}
              media={media}
              videoAlt={content?.heading}
            />
          </div>

          <div
            className={`flex w-full items-center md:before:float-left ${aspectDesktop} ${contentOrderClasses}`}
          >
            <HalfHeroContent
              aboveTheFold={section?.aboveTheFold}
              content={content}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}

HalfHero.displayName = 'HalfHero';
HalfHero.Schema = Schema;
