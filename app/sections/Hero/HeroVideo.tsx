import {Image} from '~/components/Image';
import {usePlayWhileInView, useViewportBreakpoint} from '~/hooks';

import type {HeroVideoProps} from './Hero.types';

export function HeroVideo({
  isVisible,
  posterUrl,
  priority,
  video,
  viewport,
}: HeroVideoProps) {
  const breakpoint = useViewportBreakpoint();
  const {inViewRef, videoRef} = usePlayWhileInView({shouldPlay: isVisible});

  // Mount only the copy for the current breakpoint; the other copy is hidden
  // with CSS and would otherwise still download and decode
  const shouldMountVideo = isVisible && breakpoint === viewport;

  return (
    <div ref={inViewRef} className="absolute inset-0 size-full">
      {shouldMountVideo ? (
        <video
          className="media-fill"
          controls={false}
          loop
          muted
          playsInline
          poster={posterUrl}
          preload={priority ? 'auto' : 'metadata'}
          ref={videoRef}
          key={video?.url}
        >
          {video?.url && <source src={video.url} type={video.format} />}
        </video>
      ) : (
        isVisible &&
        posterUrl && (
          <Image
            data={{url: posterUrl}}
            className="media-fill"
            loading={priority ? 'eager' : 'lazy'}
            sizes="100vw"
            withLoadingAnimation={false}
          />
        )
      )}
    </div>
  );
}

HeroVideo.displayName = 'HeroVideo';
