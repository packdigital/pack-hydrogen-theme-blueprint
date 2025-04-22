import clsx from 'clsx';

import {Container} from '~/components/Container';

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
    mediaWidthRatio = '1/2',
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
  const desktopGridColsClass =
    mediaOrderDesktop === '2'
      ? mediaWidthRatio === '3/4'
        ? 'md:grid-cols-[1fr_3fr]'
        : mediaWidthRatio === '2/3'
        ? 'md:grid-cols-[1fr_2fr]'
        : mediaWidthRatio === '3/5'
        ? 'md:grid-cols-[2fr_3fr]'
        : 'md:grid-cols-[1fr_1fr]'
      : mediaWidthRatio === '3/4'
      ? 'md:grid-cols-[3fr_1fr]'
      : mediaWidthRatio === '2/3'
      ? 'md:grid-cols-[2fr_1fr]'
      : mediaWidthRatio === '3/5'
      ? 'md:grid-cols-[3fr_2fr]'
      : 'md:grid-cols-[1fr_1fr]';

  return (
    <Container container={cms.container}>
      <div
        className={clsx(
          !section?.fullBleed && 'px-contained',
          section?.verticalPadding && 'py-contained',
        )}
      >
        <div
          className={clsx(
            'relative mx-auto grid grid-cols-1 items-center',
            desktopGridColsClass,
            maxWidthContainerClass,
          )}
        >
          <div
            className={clsx(
              'relative w-full bg-neutralLightest',
              'max-md:before:float-left',
              aspectMobile,
              fillClass,
              mediaOrderClasses,
            )}
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
            className={clsx(
              'flex w-full items-center',
              'md:before:float-left',
              aspectDesktop,
              contentOrderClasses,
            )}
          >
            <HalfHeroContent
              aboveTheFold={section?.aboveTheFold}
              content={content}
              fullBleed={section?.fullBleed}
              mediaOrderDesktop={mediaOrderDesktop}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}

HalfHero.displayName = 'HalfHero';
HalfHero.Schema = Schema;
