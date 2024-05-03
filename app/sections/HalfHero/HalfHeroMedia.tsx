import {getAspectRatioFromPercentage} from '~/lib/utils';
import {Image} from '~/components';

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

  return (
    <div className="absolute inset-0 size-full">
      <div className="relative size-full overflow-hidden md:hidden">
        {video?.srcMobile && (
          <HalfHeroVideo
            autoplay={video.autoplay}
            posterSrc={video.posterMobile?.src}
            sound={video.sound}
            videoAlt={videoAlt}
            videoSrc={video.srcMobile}
          />
        )}

        {!video?.srcMobile && (
          <Image
            data={{
              altText: image?.imageMobile?.altText || image?.alt,
              url: image?.imageMobile?.src,
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
        {video?.srcDesktop && (
          <HalfHeroVideo
            autoplay={video.autoplay}
            posterSrc={video.posterDesktop?.src}
            sound={video.sound}
            videoAlt={videoAlt}
            videoSrc={video.srcDesktop}
          />
        )}

        {!video?.srcDesktop && (
          <Image
            data={{
              altText: image?.imageDesktop?.altText || image?.alt,
              url: image?.imageDesktop?.src,
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
