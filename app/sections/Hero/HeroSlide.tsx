import {useEffect, useState} from 'react';

import {Image} from '~/components';

import {HeroContent} from './HeroContent';
import {HeroVideo} from './HeroVideo';
import type {HeroSlideProps} from './Hero.types';

export function HeroSlide({
  aboveTheFold,
  isActiveSlide,
  isFirstSlide,
  slide,
}: HeroSlideProps) {
  const {image, video} = slide;
  const [mounted, setMounted] = useState(aboveTheFold && isActiveSlide);

  const isVisible =
    (aboveTheFold && isActiveSlide) ||
    (!aboveTheFold && isActiveSlide && mounted);

  useEffect(() => {
    if (mounted) return;
    if (isActiveSlide && !mounted) {
      setMounted(true);
    }
  }, [isActiveSlide]);

  return (
    <div className="relative size-full">
      <div className="relative size-full overflow-hidden md:hidden">
        {video?.srcMobile && (
          <HeroVideo
            isVisible={isVisible}
            posterSrc={video.posterMobile?.src}
            videoSrc={video.srcMobile}
          />
        )}

        {image?.imageMobile?.src && !video?.srcMobile && (
          <Image
            data={{
              altText: image.imageMobile.altText || image.alt,
              url: mounted ? image.imageMobile.src : '',
            }}
            className={`media-fill ${image.positionMobile}`}
            loading={aboveTheFold && isFirstSlide ? 'eager' : 'lazy'}
            sizes="100vw"
          />
        )}
      </div>

      <div className="relative hidden size-full overflow-hidden md:block">
        {video?.srcDesktop && (
          <HeroVideo
            isVisible={isVisible}
            posterSrc={video.posterDesktop?.src}
            videoSrc={video.srcDesktop}
          />
        )}

        {image?.imageDesktop?.src && !video?.srcDesktop && (
          <Image
            data={{
              altText: image.imageDesktop.altText || image.alt,
              url: mounted ? image.imageDesktop.src : '',
            }}
            className={`media-fill ${image.positionDesktop}`}
            loading={aboveTheFold && isFirstSlide ? 'eager' : 'lazy'}
            sizes="100vw"
          />
        )}
      </div>

      <HeroContent
        aboveTheFold={aboveTheFold}
        isActiveSlide={isActiveSlide}
        isFirstSlide={isFirstSlide}
        slide={slide}
      />
    </div>
  );
}

HeroSlide.displayName = 'HeroSlide';
