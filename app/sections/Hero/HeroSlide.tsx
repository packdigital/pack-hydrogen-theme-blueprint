import {useEffect, useState} from 'react';
import clsx from 'clsx';

import {Image} from '~/components/Image';
import {ResponsivePicture} from '~/components/ResponsivePicture';

import {HeroContent} from './HeroContent';
import {HeroVideo} from './HeroVideo';
import type {HeroSlideProps} from './Hero.types';

export function HeroSlide({
  aboveTheFold,
  index,
  isActiveSlide,
  isFirstSlide,
  sectionId,
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

  const hasMobileVideo = video?.videoMobile?.mediaType === 'VIDEO';
  const hasDesktopVideo = video?.videoDesktop?.mediaType === 'VIDEO';
  const shouldEagerLoad = aboveTheFold && isFirstSlide;
  const canUsePicture =
    !hasMobileVideo &&
    !hasDesktopVideo &&
    image?.imageMobile?.url &&
    image?.imageDesktop?.url;

  return (
    <div className="relative size-full">
      {canUsePicture ? (
        <div className="relative size-full overflow-hidden">
          <ResponsivePicture
            imageMobile={image.imageMobile}
            imageDesktop={image.imageDesktop}
            alt={image.alt}
            loading={shouldEagerLoad ? 'eager' : 'lazy'}
            fetchPriority={shouldEagerLoad ? 'high' : undefined}
            className={clsx(
              'media-fill',
              image.positionMobile,
              image.positionDesktop,
            )}
            sizesMobile="100vw"
            sizesDesktop="100vw"
          />
        </div>
      ) : (
        <>
          <div className="relative size-full overflow-hidden md:hidden">
            {hasMobileVideo && (
              <HeroVideo
                isVisible={isVisible}
                posterUrl={video.posterMobile?.url}
                video={video.videoMobile}
              />
            )}

            {image?.imageMobile?.url && !hasMobileVideo && (
              <Image
                data={{
                  altText: image.imageMobile.altText || image.alt,
                  url: mounted ? image.imageMobile.url : '',
                }}
                className={clsx('media-fill', image.positionMobile)}
                loading={shouldEagerLoad ? 'eager' : 'lazy'}
                sizes="100vw"
              />
            )}
          </div>

          <div className="relative hidden size-full overflow-hidden md:block">
            {hasDesktopVideo && (
              <HeroVideo
                isVisible={isVisible}
                posterUrl={video.posterDesktop?.url}
                video={video.videoDesktop}
              />
            )}

            {image?.imageDesktop?.url && !hasDesktopVideo && (
              <Image
                data={{
                  altText: image.imageDesktop.altText || image.alt,
                  url: mounted ? image.imageDesktop.url : '',
                }}
                className={clsx('media-fill', image.positionDesktop)}
                loading={shouldEagerLoad ? 'eager' : 'lazy'}
                sizes="100vw"
              />
            )}
          </div>
        </>
      )}

      <HeroContent
        aboveTheFold={aboveTheFold}
        index={index}
        isActiveSlide={isActiveSlide}
        isFirstSlide={isFirstSlide}
        sectionId={sectionId}
        slide={slide}
      />
    </div>
  );
}

HeroSlide.displayName = 'HeroSlide';
