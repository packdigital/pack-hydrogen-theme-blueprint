import {BannerContent} from 'modules/brilliant/Banner/BannerContent';

import {Container} from '~/components/Container';
import {Image} from '~/components/Image';
import {Schema} from '~/sections/Banner/Banner.schema';
import type {BannerCms} from '~/sections/Banner/Banner.types';
import {BannerContainer} from '~/sections/Banner/BannerContainer';
import {BannerVideo} from '~/sections/Banner/BannerVideo';

export function Banner({cms}: {cms: BannerCms}) {
  const {content, container, image, section, text, video} = cms;

  const hasMobileVideo = video?.videoMobile?.mediaType === 'VIDEO';
  const hasDesktopVideo = video?.videoDesktop?.mediaType === 'VIDEO';

  return (
    <Container
      container={{
        ...container,
        // NotFound page uses Banner and places bgColor in section settings
        bgColor: container?.bgColor || section?.bgColor,
      }}
    >
      <BannerContainer cms={cms}>
        <div className="absolute inset-0 size-full overflow-hidden md:hidden">
          {hasMobileVideo && (
            <BannerVideo
              aboveTheFold={section?.aboveTheFold}
              posterUrl={video?.posterMobile?.url}
              video={video?.videoMobile}
            />
          )}

          {image?.imageMobile?.url && !hasMobileVideo && (
            <Image
              data={{
                altText: image.imageMobile.altText || image.alt,
                url: image.imageMobile.url,
                width: image.imageMobile.width,
                height: image.imageMobile.height,
              }}
              className={`media-fill ${image.positionMobile}`}
              loading="eager"
              sizes="100vw"
            />
          )}
        </div>

        <div className="absolute inset-0 hidden size-full overflow-hidden border-b-2 border-blue-400 shadow md:block ">
          {hasDesktopVideo && (
            <BannerVideo
              aboveTheFold={section?.aboveTheFold}
              posterUrl={video?.posterDesktop?.url}
              video={video?.videoDesktop}
            />
          )}

          {image?.imageDesktop?.url && !hasDesktopVideo && (
            <Image
              data={{
                altText: image.imageDesktop.altText || image.alt,
                url: image.imageDesktop.url,
                width: image.imageDesktop.width,
                height: image.imageDesktop.height,
              }}
              className={`media-fill ${image.positionDesktop}`}
              loading="eager"
              sizes="100vw"
            />
          )}
        </div>

        <BannerContent
          aboveTheFold={section?.aboveTheFold}
          content={content}
          text={text}
        />
      </BannerContainer>
    </Container>
  );
}

Banner.displayName = 'Banner';
Banner.Schema = Schema;
