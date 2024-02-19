import {useInView} from 'react-intersection-observer';

import {Container} from '~/components';

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

  return (
    <Container container={cms.container}>
      <div
        className={`[&_iframe]:!h-full [&_iframe]:!w-full ${
          enableYPadding ? 'py-4 md:py-6 lg:py-8' : ''
        } ${enableXPadding ? 'px-contained' : ''}`}
        ref={inViewRef}
      >
        <div
          className={`mx-auto bg-offWhite ${maxWidth} ${aspectRatio}`}
          dangerouslySetInnerHTML={{__html: inView ? embed : ''}}
        />
      </div>
    </Container>
  );
}

VideoEmbed.displayName = 'VideoEmbed';
VideoEmbed.Schema = Schema;
