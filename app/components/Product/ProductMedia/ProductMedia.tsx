import {useCallback, useEffect, useState} from 'react';
import type {EmblaCarouselType} from 'embla-carousel';
import type {Image} from '@shopify/hydrogen/storefront-api-types';

import {Badges} from '~/components/Badges';
import {Carousel} from '~/components/Carousel';
import type {ProductWithStatus} from '~/lib/types';

import {ProductMediaFile} from './ProductMediaFile';
import {ProductMediaThumbnails} from './ProductMediaThumbnails';
import {ProductDraftMediaOverlay} from './ProductDraftMediaOverlay';
import {useProductMedia} from './useProductMedia';
import type {ProductMediaProps} from './ProductMedia.types';

export function ProductMedia({
  product,
  selectedVariant,
  selectedVariantColor,
}: ProductMediaProps) {
  const [mainApi, setMainApi] = useState<EmblaCarouselType | null>(null);

  const {initialIndex, maybeHasImagesByVariant, media} = useProductMedia({
    product,
    selectedVariant,
  });

  const [activeIndex, setActiveIndex] = useState<number>(initialIndex);

  // Reset/advance the gallery when the selected color changes
  useEffect(() => {
    if (!mainApi) return;
    if (maybeHasImagesByVariant) {
      const mediaIndex = product.media.nodes.findIndex(
        ({previewImage}) => previewImage?.url === selectedVariant?.image?.url,
      );
      const index = mediaIndex >= 0 ? mediaIndex : 0;
      mainApi.scrollTo(index);
      setActiveIndex(index);
      return;
    }
    setActiveIndex(0);
    mainApi.scrollTo(0);
  }, [maybeHasImagesByVariant, selectedVariantColor, mainApi]);

  const scrollToIndex = useCallback(
    (index: number) => mainApi?.scrollTo(index),
    [mainApi],
  );

  const firstMediaImageOnMount = media[initialIndex]?.previewImage as
    Image | undefined;

  return (
    <div className="grid grid-cols-1 justify-between gap-4 lg:grid-cols-[80px_calc(100%-100px)] xl:gap-5">
      <div className="order-1 lg:order-2">
        <div
          className="relative md:bg-neutralLightest"
          // for a static/consistent aspect ratio, delete style below and add 'aspect-[var(--product-image-aspect-ratio)]' to className
          // set var(--product-image-aspect-ratio) in styles/app.css
          style={{
            aspectRatio:
              firstMediaImageOnMount?.width && firstMediaImageOnMount?.height
                ? firstMediaImageOnMount.width / firstMediaImageOnMount.height
                : 'var(--product-image-aspect-ratio)',
          }}
        >
          <Carousel
            ariaLabel={`${product.title} media`}
            className="size-full"
            dots
            dotsClassName="md:hidden"
            onApi={setMainApi}
            onSelect={setActiveIndex}
            options={{startIndex: initialIndex}}
            slideClassName="size-full"
            slides={media.map((mediaItem, index) => (
              <ProductMediaFile
                alt={product.title}
                key={mediaItem.id}
                media={mediaItem}
                priority={index === initialIndex}
              />
            ))}
            viewportClassName="size-full"
          >
            {(product as ProductWithStatus).status === 'DRAFT' && (
              <ProductDraftMediaOverlay />
            )}
          </Carousel>

          <div className="pointer-events-none absolute left-0 top-0 z-[1] p-2.5 xs:p-4 md:p-3 xl:p-4">
            <Badges tags={product.tags} />
          </div>
        </div>
      </div>

      {/*
       * Thumbnails: a native scrollable strip (horizontal on mobile, vertical
       * column on desktop) synced to the gallery. Clicking a thumb scrolls the
       * gallery; the active thumb is scrolled into view.
       */}
      <div className="relative order-2 hidden w-full md:block lg:order-1 lg:h-[calc(80px*5+12px*4)] xl:h-[calc(80px*6+12px*5)]">
        {media.length > 0 && (
          <ProductMediaThumbnails
            activeIndex={activeIndex}
            media={media}
            onThumbClick={scrollToIndex}
            productTitle={product.title}
          />
        )}
      </div>
    </div>
  );
}

ProductMedia.displayName = 'ProductMedia';
