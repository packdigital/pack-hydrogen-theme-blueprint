import clsx from 'clsx';
import kebabCase from 'lodash/kebabCase';

import {Container} from '~/components/Container';
import {Image} from '~/components/Image';

import {BannerContainer} from './BannerContainer';
import {BannerContent} from './BannerContent';
import {BannerVideo} from './BannerVideo';
import {Schema} from './Banner.schema';
import type {BannerCms} from './Banner.types';

export function Banner({cms}: {cms: BannerCms}) {
  const {content, container, image, section, text, video} = cms;
  // Section name temporarily used as section id until cms supports ids.
  // To avoid styling conflicts between 2+ banners on the same page, ensure section names are unique
  const sectionId = kebabCase(cms.sectionName);

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
      <BannerContainer cms={cms} sectionId={sectionId}>
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
              className={clsx('media-fill', image.positionMobile)}
              loading="eager"
              sizes="100vw"
            />
          )}
        </div>

        <div className="absolute inset-0 hidden size-full overflow-hidden md:block">
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
              className={clsx('media-fill', image.positionDesktop)}
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
