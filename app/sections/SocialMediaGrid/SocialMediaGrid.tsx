import {useInView} from 'react-intersection-observer';
import clsx from 'clsx';

import {Container} from '~/components/Container';
import {Image} from '~/components/Image';
import {Link} from '~/components/Link';
import {Svg} from '~/components/Svg';

import {Schema} from './SocialMediaGrid.schema';
import type {SocialMediaGridCms} from './SocialMediaGrid.types';

export function SocialMediaGrid({cms}: {cms: SocialMediaGridCms}) {
  const {ref, inView} = useInView({
    rootMargin: '200px',
    triggerOnce: true,
  });

  const {media, section} = cms;
  const {aspectRatio = 'aspect-[1/1]', gridGap = 'gap-[1px]'} = {...section};
  const maxWidthClass = section?.fullWidth
    ? 'max-w-none'
    : 'max-w-[var(--content-max-width)]';

  return (
    <Container container={cms.container}>
      <div
        className={clsx('py-px', !section?.fullBleed && 'px-contained')}
        ref={ref}
      >
        <div
          className={clsx(
            'mx-auto grid grid-cols-2 sm:grid-cols-4',
            gridGap,
            maxWidthClass,
          )}
        >
          {media?.slice(0, 4).map((item, index) => {
            const videoUrl =
              item.video?.mediaType === 'VIDEO' ? item.video.url : undefined;
            const image =
              item.image?.mediaType !== 'VIDEO' ? item.image : undefined;
            return (
              <li key={index}>
                <Link
                  aria-label={`Open new tab to view ${item.platform} post`}
                  to={item.url}
                  newTab
                >
                  <div
                    className={clsx('relative bg-neutralLightest', aspectRatio)}
                  >
                    {inView && (
                      <>
                        {videoUrl ? (
                          <video
                            autoPlay
                            className="media-fill object-cover"
                            loop
                            muted
                            playsInline
                            poster={image?.url}
                            key={videoUrl}
                          >
                            <source src={videoUrl} type="video/mp4" />
                          </video>
                        ) : (
                          <Image
                            data={{
                              altText: image?.altText || item.alt,
                              url: image?.url,
                              width: image?.width,
                              height: image?.height,
                            }}
                            aspectRatio="1/1"
                            className="media-fill"
                            sizes="(min-width: 768px) 25vw, 50vw"
                          />
                        )}
                      </>
                    )}

                    <Svg
                      className="absolute right-2 top-2 w-4 text-white lg:right-3 lg:top-3 lg:w-5"
                      src={`/svgs/social/${item.platform}.svg#${item.platform}`}
                      title={item.platform}
                      viewBox="0 0 24 24"
                    />
                  </div>
                </Link>
              </li>
            );
          })}
        </div>
      </div>
    </Container>
  );
}

SocialMediaGrid.displayName = 'SocialMediaGrid';
SocialMediaGrid.Schema = Schema;
