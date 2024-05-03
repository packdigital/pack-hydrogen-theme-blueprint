import {useInView} from 'react-intersection-observer';

import {getAspectRatioFromClass} from '~/lib/utils';
import {Image, Link} from '~/components';

import type {CollectionPromoTileProps} from './Collection.types';

export function CollectionPromoTile({tile}: CollectionPromoTileProps) {
  const {ref, inView} = useInView({
    rootMargin: '0px',
    triggerOnce: true,
  });

  const {aspectRatio = 'aspect-[3/4]', background, link, text} = tile;
  const {alt, bgColor, darkOverlay, image, videoPoster, videoSrc} = {
    ...background,
  };

  return (
    <Link
      aria-label={text?.heading || link?.text}
      className="h-full"
      to={link?.url}
      newTab={link?.newTab}
      ref={ref}
      type={link?.type}
    >
      <div
        className={`relative ${aspectRatio} overflow-hidden`}
        style={{
          backgroundColor: image ? 'var(--off-white)' : bgColor,
        }}
      >
        {videoSrc && (
          <video
            autoPlay
            className="absolute inset-0 size-full object-cover"
            controls={false}
            loop
            muted
            playsInline
            poster={videoPoster?.src}
          >
            {inView && <source src={videoSrc} type="video/mp4" />}
          </video>
        )}

        {image?.src && !videoSrc && (
          <Image
            data={{
              altText: image.altText || alt,
              url: image.src,
              width: image.width,
              height: image.height,
            }}
            aspectRatio={getAspectRatioFromClass(aspectRatio)}
            className="media-fill"
            sizes="(min-width: 768px) 33vw, 50vw"
          />
        )}

        {(videoSrc || image?.src) && darkOverlay && (
          <div className="pointer-events-none absolute inset-0 size-full bg-[rgba(0,0,0,0.2)]" />
        )}

        {(text?.heading || text?.subtext) && (
          <div
            className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 px-4 text-center"
            style={{color: text?.textColor}}
          >
            <h3 className="text-xl lg:text-2xl">{text?.heading}</h3>

            {text?.subtext && (
              <p className="mt-4 text-sm lg:text-base">{text?.subtext}</p>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

CollectionPromoTile.displayName = 'CollectionPromoTile';
