import {Image} from '~/components/Image';
import type {ProductMediaThumbnailProps} from '~/components/Product/ProductMedia/ProductMedia.types';
import {Svg} from '~/components/Svg';

export function ProductMediaThumbnail({
  alt,
  image,
  index,
  isActive,
  mediaContentType = 'IMAGE',
  swiper,
}: ProductMediaThumbnailProps) {
  return (
    <button
      aria-label={`Slide to product image ${index + 1}`}
      className={`relative flex aspect-square w-full select-none items-center justify-center overflow-hidden rounded border transition ${
        isActive ? ' border-black' : 'border-transparent'
      }`}
      onClick={() => swiper?.slideTo(index)}
      type="button"
    >
      <div className="overflow-hidden border bg-white p-1">
        <Image
          data={{
            ...image,
            altText: alt || image?.altText,
          }}
          aspectRatio="1/1"
          width="80px"
          loading={index < 6 ? 'eager' : 'lazy'}
        />

        {mediaContentType === 'VIDEO' && (
          <Svg
            className="absolute left-1/2 top-1/2 w-1/3 -translate-x-1/2 -translate-y-1/2 text-white"
            src="/svgs/play.svg#play"
            title="Play"
            viewBox="0 0 24 24"
          />
        )}
      </div>
    </button>
  );
}

ProductMediaThumbnail.displayName = 'ProductMediaThumbnail';
