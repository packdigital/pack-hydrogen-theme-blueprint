import {Container, Link} from '~/components';

import {Schema} from './Video.schema';
import {VideoElement} from './VideoElement';
import type {VideoCms} from './Video.types';

export function Video({cms}: {cms: VideoCms}) {
  const {content, media, play, section} = cms;
  const {
    title,
    srcDesktop,
    posterDesktop,
    aspectDesktop,
    srcMobile,
    posterMobile,
    aspectMobile,
  } = {
    ...media,
  };
  const {maxWidth, enableYPadding, enableXPadding} = {...section};
  const isLink = content?.link?.url && !play?.pauseAndPlay && !play?.controls;

  return (
    <Container container={cms.container}>
      <div
        className={`${enableYPadding ? 'py-4 md:py-6 lg:py-8' : ''} ${
          enableXPadding ? 'px-contained' : ''
        }`}
      >
        <Link
          aria-label={content?.link?.text}
          className={`mx-auto ${maxWidth}`}
          to={isLink ? content?.link?.url : undefined}
          newTab={isLink ? content?.link?.newTab : false}
          type={isLink ? content?.link?.type : undefined}
        >
          <div className={`relative bg-offWhite md:hidden ${aspectMobile}`}>
            {srcMobile && (
              <VideoElement
                playOptions={play}
                posterSrc={posterMobile?.src}
                title={title}
                videoSrc={srcMobile}
              />
            )}
          </div>

          <div
            className={`relative hidden bg-offWhite md:block ${aspectDesktop}`}
          >
            {srcDesktop && (
              <VideoElement
                playOptions={play}
                posterSrc={posterDesktop?.src}
                title={title}
                videoSrc={srcDesktop}
              />
            )}
          </div>
        </Link>
      </div>
    </Container>
  );
}

Video.displayName = 'Video';
Video.Schema = Schema;
