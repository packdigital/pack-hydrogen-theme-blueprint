import {MediaFile} from '@shopify/hydrogen';
import {useInView} from 'react-intersection-observer';
import type {Image} from '@shopify/hydrogen/storefront-api-types';

import {ProductImage} from './ProductImage';
import {ProductVideo} from './ProductVideo';
import type {ProductMediaFileProps} from './ProductMedia.types';

type MediaFileData = React.ComponentProps<typeof MediaFile>['data'];
type TypeName = MediaFileData['__typename'];

const TYPE_NAME_MAP: Record<string, TypeName> = {
  MODEL_3D: 'Model3d',
  VIDEO: 'Video',
  IMAGE: 'MediaImage',
  EXTERNAL_VIDEO: 'ExternalVideo',
};

export function ProductMediaFile({
  alt,
  media,
  onLoad,
  priority,
}: ProductMediaFileProps) {
  const {mediaContentType} = media;
  const {ref, inView} = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  const image = {...media.previewImage} as Image;
  const {height, width} = image;
  const __typename = TYPE_NAME_MAP[mediaContentType];

  return (
    <div
      className="relative bg-neutralLightest"
      ref={ref}
      style={{
        aspectRatio:
          width && height
            ? width / height
            : 'var(--product-image-aspect-ratio)',
      }}
    >
      {(priority || inView) && (
        <>
          {mediaContentType === 'IMAGE' && (
            <ProductImage
              alt={alt}
              image={image}
              onLoad={onLoad}
              priority={priority}
            />
          )}

          {mediaContentType === 'EXTERNAL_VIDEO' && (
            <MediaFile
              data={{...media, __typename} as MediaFileData}
              className="media-fill"
              onLoad={onLoad}
            />
          )}

          {mediaContentType === 'MODEL_3D' && (
            <MediaFile
              data={{...media, __typename} as MediaFileData}
              className="media-fill"
              onLoad={onLoad}
            />
          )}
        </>
      )}

      {mediaContentType === 'VIDEO' && (
        <ProductVideo
          inView={inView}
          media={media}
          onLoad={onLoad}
          priority={priority}
        />
      )}
    </div>
  );
}

ProductMediaFile.displayName = 'ProductMediaFile';
