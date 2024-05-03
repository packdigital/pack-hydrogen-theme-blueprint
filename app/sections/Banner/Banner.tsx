import {Container, Image} from '~/components';

import {BannerContainer} from './BannerContainer';
import {BannerContent} from './BannerContent';
import type {BannerCms} from './Banner.types';
import {Schema} from './Banner.schema';

export function Banner({cms}: {cms: BannerCms}) {
  const {content, image, section, text} = cms;

  return (
    <Container container={cms.container}>
      <BannerContainer cms={cms}>
        <div className="absolute inset-0 size-full overflow-hidden md:hidden">
          {image?.imageMobile?.src && (
            <Image
              data={{
                altText: image.imageMobile.altText || image.alt,
                url: image.imageMobile.src,
                width: image.imageMobile.width,
                height: image.imageMobile.height,
              }}
              className={`media-fill ${image.positionMobile}`}
              loading="eager"
              sizes="100vw"
            />
          )}
        </div>

        <div className="absolute inset-0 hidden size-full overflow-hidden md:block">
          {image?.imageDesktop?.src && (
            <Image
              data={{
                altText: image.imageDesktop.altText || image.alt,
                url: image.imageDesktop.src,
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
