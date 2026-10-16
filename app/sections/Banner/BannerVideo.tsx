import {getVideoSrcWithFirstFrame} from '~/lib/utils';
import {Image} from '~/components/Image';
import {VideoPlayButton} from '~/components/VideoPlayButton';
import {usePlayWhileInView, useViewportBreakpoint} from '~/hooks';

import type {BannerVideoProps} from './Banner.types';

export function BannerVideo({
  aboveTheFold,
  posterUrl,
  video,
  viewport,
}: BannerVideoProps) {
  const breakpoint = useViewportBreakpoint();
  const {inViewRef, videoRef, hasBeenInView, isAutoplayBlocked, play} =
    usePlayWhileInView();

  // Mount only the copy for the current breakpoint; the other copy is hidden
  // with CSS and would otherwise still download and decode
  const shouldMountVideo =
    breakpoint === viewport && (aboveTheFold || hasBeenInView);

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
          preload={aboveTheFold ? 'auto' : 'metadata'}
          ref={videoRef}
          key={video?.url}
        >
          {video?.url && (
            <source
              src={getVideoSrcWithFirstFrame(video.url)}
              type={video.format}
            />
          )}
        </video>
      ) : (
        posterUrl && (
          <Image
            data={{url: posterUrl}}
            className="media-fill"
            loading={aboveTheFold ? 'eager' : 'lazy'}
            sizes="100vw"
            withLoadingAnimation={false}
          />
        )
      )}

      {shouldMountVideo && isAutoplayBlocked && (
        <VideoPlayButton onPlay={play} position="corner" />
      )}
    </div>
  );
}

BannerVideo.displayName = 'BannerVideo';
