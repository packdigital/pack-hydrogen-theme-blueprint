import {getAspectRatioFromPercentage} from '~/lib/utils';
import {Image} from '~/components/Image';

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

  return (
    <div className="absolute inset-0 size-full">
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
              width: image?.imageMobile?.width,
              height: image?.imageMobile?.height,
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
              width: image?.imageDesktop?.width,
              height: image?.imageDesktop?.height,
            }}
            aspectRatio={getAspectRatioFromPercentage(aspectDesktop)}
            crop={image?.cropDesktop}
            className="media-fill"
            loading={aboveTheFold ? 'eager' : 'lazy'}
            sizes="50vw"
          />
        )}
      </div>
    </div>
  );
}

HalfHeroMedia.displayName = 'HalfHeroMedia';
