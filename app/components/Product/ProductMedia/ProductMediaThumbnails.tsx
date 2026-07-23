import {useEffect, useRef} from 'react';

import {ProductMediaThumbnail} from './ProductMediaThumbnail';
import type {ProductMediaThumbnailsProps} from './ProductMedia.types';

export function ProductMediaThumbnails({
  activeIndex,
  media,
  onThumbClick,
  productTitle,
}: ProductMediaThumbnailsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep the active thumbnail scrolled into view (works for both the mobile
  // horizontal strip and the desktop vertical column).
  useEffect(() => {
    const el = containerRef.current?.children[activeIndex ?? 0] as
      HTMLElement | undefined;
    el?.scrollIntoView({block: 'nearest', inline: 'nearest'});
  }, [activeIndex]);

  return (
    <div
      className="scrollbar-hide flex h-full gap-2 overflow-x-auto max-lg:flex-row lg:flex-col lg:gap-3 lg:overflow-y-auto lg:overflow-x-hidden"
      ref={containerRef}
    >
      {media.map((mediaItem, index) => (
        <div
          className="shrink-0 basis-[calc((100%-5*8px)/6)] lg:basis-auto"
          key={mediaItem.id}
        >
          <ProductMediaThumbnail
            alt={productTitle}
            image={mediaItem.previewImage}
            index={index}
            isActive={index === activeIndex}
            mediaContentType={mediaItem.mediaContentType}
            onThumbClick={onThumbClick}
          />
        </div>
      ))}
    </div>
  );
}

ProductMediaThumbnails.displayName = 'ProductMediaThumbnails';
