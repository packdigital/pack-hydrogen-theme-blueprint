import clsx from 'clsx';

import {Container} from '~/components/Container';
import {Link} from '~/components/Link';

import {Schema} from './Video.schema';
import {VideoElement} from './VideoElement';
import type {VideoCms} from './Video.types';

export function Video({cms}: {cms: VideoCms}) {
  const {content, media, play, section} = cms;
  const {
    title,
    videoDesktop,
    posterDesktop,
    aspectDesktop,
    videoMobile,
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
        className={clsx(
          enableYPadding && 'py-4 md:py-6 lg:py-8',
          enableXPadding && 'px-contained',
        )}
      >
        <Link
          aria-label={content?.link?.text}
          className={clsx('mx-auto', maxWidth)}
          to={isLink ? content?.link?.url : undefined}
          newTab={isLink ? content?.link?.newTab : false}
          type={isLink ? content?.link?.type : undefined}
        >
          <div
            className={clsx(
              'relative bg-neutralLightest md:hidden',
              aspectMobile,
            )}
          >
            {videoMobile?.mediaType === 'VIDEO' && (
              <VideoElement
                playOptions={play}
                posterUrl={posterMobile?.url}
                title={title}
                video={videoMobile}
              />
            )}
          </div>

          <div
            className={clsx(
              'relative hidden bg-neutralLightest md:block',
              aspectDesktop,
            )}
          >
            {videoDesktop?.mediaType === 'VIDEO' && (
              <VideoElement
                playOptions={play}
                posterUrl={posterDesktop?.url}
                title={title}
                video={videoDesktop}
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
