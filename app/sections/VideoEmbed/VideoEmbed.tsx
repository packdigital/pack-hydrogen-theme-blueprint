import {useMemo} from 'react';
import {useInView} from 'react-intersection-observer';
import clsx from 'clsx';
import sanitizeHtml from 'sanitize-html';

import {Container} from '~/components/Container';

import {Schema} from './VideoEmbed.schema';
import type {VideoEmbedCms} from './VideoEmbed.types';

export function VideoEmbed({cms}: {cms: VideoEmbedCms}) {
  const {media, section} = cms;
  const {embed, aspectRatio = 'aspect-[16/9]'} = {...media};
  const {maxWidth, enableYPadding, enableXPadding} = {...section};

  const {ref: inViewRef, inView} = useInView({
    rootMargin: '0px',
    triggerOnce: true,
  });

  // Docs: https://www.npmjs.com/package/sanitize-html
  const sanitizedEmbed = useMemo(() => {
    return inView
      ? sanitizeHtml(embed || '', {
          allowedTags: ['p', 'em', 'strong', 'iframe'],
          allowedAttributes: {
            iframe: [
              'src',
              'title',
              'width',
              'height',
              'allow',
              'referrerpolicy',
              'allowfullscreen',
            ],
          },
          // Add any additional allowed iframe hostnames here
          allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com'],
        })
      : '';
  }, [embed, inView]);

  return (
    <Container container={cms.container}>
      <div
        className={clsx(
          '[&_iframe]:!h-full [&_iframe]:!w-full',
          enableYPadding && 'py-4 md:py-6 lg:py-8',
          enableXPadding && 'px-contained',
        )}
        ref={inViewRef}
      >
        <div
          className={clsx('mx-auto bg-neutralLightest', maxWidth, aspectRatio)}
          dangerouslySetInnerHTML={{__html: sanitizedEmbed}}
        />
      </div>
    </Container>
  );
}

VideoEmbed.displayName = 'VideoEmbed';
VideoEmbed.Schema = Schema;
