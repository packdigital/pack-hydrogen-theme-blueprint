import {Image} from '~/components/Image';
import {PRODUCT_IMAGE_ASPECT_RATIO} from '~/lib/constants';

import type {ProductImageProps} from './ProductMedia.types';

export function ProductImage({
  alt,
  image,
  onLoad,
  priority,
}: ProductImageProps) {
  return (
    <Image
      data={{
        ...image,
        altText: alt || image?.altText,
      }}
      aspectRatio={
        image?.width && image?.height
          ? `${image.width}/${image.height}`
          : PRODUCT_IMAGE_ASPECT_RATIO
      }
      onLoad={onLoad}
      className="media-fill"
      loading={priority ? 'eager' : 'lazy'}
      sizes="(min-width: 1440px) 900px, (min-width: 768px) 50vw, 100vw"
    />
  );
}

ProductImage.displayName = 'ProductImage';
