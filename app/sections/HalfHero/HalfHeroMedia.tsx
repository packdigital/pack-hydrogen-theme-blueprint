import {getAspectRatioFromPercentage} from '~/lib/utils';
import {Image} from '~/components/Image';
import {ResponsivePicture} from '~/components/ResponsivePicture';

import type {HalfHeroMediaProps} from './HalfHero.types';
import {HalfHeroVideo} from './HalfHeroVideo';

export function HalfHeroMedia({
  aboveTheFold,
  aspectDesktop,
  aspectMobile,
  media,
  videoAlt,
}: HalfHeroMediaProps) {
  const {image, video} = {...media};

  const hasMobileVideo = video?.videoMobile?.mediaType === 'VIDEO';
  const hasDesktopVideo = video?.videoDesktop?.mediaType === 'VIDEO';
  const canUsePicture =
    !hasMobileVideo &&
    !hasDesktopVideo &&
    image?.imageMobile?.url &&
    image?.imageDesktop?.url;

  return (
    <div className="absolute inset-0 size-full">
      {canUsePicture ? (
        <div className="relative size-full overflow-hidden">
          <ResponsivePicture
            imageMobile={image.imageMobile}
            imageDesktop={image.imageDesktop}
            alt={image.alt}
            loading={aboveTheFold ? 'eager' : 'lazy'}
            fetchPriority={aboveTheFold ? 'high' : undefined}
            cropMobile={image.cropMobile}
            cropDesktop={image.cropDesktop}
            className="media-fill"
            sizesMobile="100vw"
            sizesDesktop="50vw"
          />
        </div>
      ) : (
        <>
          <div className="relative size-full overflow-hidden md:hidden">
            {hasMobileVideo && (
              <HalfHeroVideo
                autoplay={video.autoplay}
                posterUrl={video.posterMobile?.url}
                sound={video.sound}
                video={video.videoMobile}
                videoAlt={videoAlt}
              />
            )}

            {!hasMobileVideo && (
              <Image
                data={{
                  altText: image?.imageMobile?.altText || image?.alt,
                  url: image?.imageMobile?.url,
                }}
                aspectRatio={getAspectRatioFromPercentage(aspectMobile)}
                crop={image?.cropMobile}
                className="media-fill"
                loading={aboveTheFold ? 'eager' : 'lazy'}
                sizes="100vw"
              />
            )}
          </div>

          <div className="relative hidden size-full overflow-hidden md:block">
            {hasDesktopVideo && (
              <HalfHeroVideo
                autoplay={video.autoplay}
                posterUrl={video.posterDesktop?.url}
                sound={video.sound}
                video={video.videoDesktop}
                videoAlt={videoAlt}
              />
            )}

            {!hasDesktopVideo && (
              <Image
                data={{
                  altText: image?.imageDesktop?.altText || image?.alt,
                  url: image?.imageDesktop?.url,
                }}
                aspectRatio={getAspectRatioFromPercentage(aspectDesktop)}
                crop={image?.cropDesktop}
                className="media-fill"
                loading={aboveTheFold ? 'eager' : 'lazy'}
                sizes="50vw"
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

HalfHeroMedia.displayName = 'HalfHeroMedia';
