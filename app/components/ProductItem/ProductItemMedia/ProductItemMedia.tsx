import {useRef} from 'react';
import {useInView} from 'react-intersection-observer';
import clsx from 'clsx';
import type {Video} from '@shopify/hydrogen/storefront-api-types';

import {Badges} from '~/components/Badges';
import {Image} from '~/components/Image';
import {ProductDraftMediaOverlay} from '~/components/Product';
import type {ProductWithStatus} from '~/lib/types';

import type {ProductItemMediaProps} from '../ProductItem.types';

import {ProductItemVideo} from './ProductItemVideo';
import {useProductItemMedia} from './useProductItemMedia';

export function ProductItemMedia({
  hasGrouping,
  selectedProduct,
  selectedVariant,
}: ProductItemMediaProps) {
  const {ref: inViewRef, inView} = useInView({
    rootMargin: '200px',
    triggerOnce: true,
  });
  const hoverVideoRef = useRef<HTMLVideoElement>(null);

  const {primaryMedia, hoverMedia} = useProductItemMedia({
    hasGrouping,
    selectedProduct,
    selectedVariant,
  });

  const {width, height} = {...primaryMedia?.previewImage};

  return (
    <div
      className="group/media relative overflow-hidden bg-neutralLightest before:via-[black-100/10]"
      // for a static/consistent aspect ratio, delete style below and add 'aspect-[var(--product-image-aspect-ratio)]' to className
      // set var(--product-image-aspect-ratio) in styles/app.css
      style={{
        aspectRatio:
          width && height
            ? width / height
            : 'var(--product-image-aspect-ratio)',
      }}
      onMouseEnter={() => {
        if (hoverMedia?.mediaContentType !== 'VIDEO') return;
        hoverVideoRef.current?.play();
      }}
      onMouseLeave={() => {
        if (hoverMedia?.mediaContentType !== 'VIDEO') return;
        hoverVideoRef.current?.pause();
      }}
      ref={inViewRef}
    >
      {primaryMedia && (
        <div
          className={clsx(
            hoverMedia &&
              'opacity-100 transition duration-300 md:group-hover/media:opacity-0',
          )}
        >
          {primaryMedia.mediaContentType === 'VIDEO' ? (
            <ProductItemVideo autoPlay media={primaryMedia as Video} />
          ) : (
            <Image
              data={{
                ...primaryMedia.previewImage,
                altText: selectedProduct?.title,
              }}
              className="media-fill"
              loading="eager"
              sizes="(min-width: 768px) 30vw, 45vw"
            />
          )}
        </div>
      )}

      {inView && hoverMedia && (
        <div className="hidden opacity-0 transition duration-300 md:block md:group-hover/media:opacity-100">
          {hoverMedia.mediaContentType === 'VIDEO' ? (
            <ProductItemVideo
              autoPlay={false}
              media={hoverMedia as Video}
              ref={hoverVideoRef}
            />
          ) : (
            <Image
              data={{
                ...hoverMedia.previewImage,
                altText: selectedProduct?.title,
              }}
              className="media-fill"
              sizes="(min-width: 768px) 30vw, 45vw"
            />
          )}
        </div>
      )}

      {/* loading shimmer */}
      {!primaryMedia && (
        <div className="relative size-full overflow-hidden">
          <div className="loading-shimmer opacity-60" />
        </div>
      )}

      {(selectedProduct as ProductWithStatus)?.status === 'DRAFT' && (
        <ProductDraftMediaOverlay />
      )}

      <div className="pointer-events-none absolute left-0 top-0 z-[1] p-2.5 xs:p-3 xl:p-4">
        <Badges
          className="max-xl:text-label-sm gap-2 xs:gap-2 [&_div]:max-xl:px-1.5 [&_div]:max-xl:py-0.5"
          tags={selectedProduct?.tags || []}
        />
      </div>
    </div>
  );
}

ProductItemMedia.displayName = 'ProductItemMedia';
