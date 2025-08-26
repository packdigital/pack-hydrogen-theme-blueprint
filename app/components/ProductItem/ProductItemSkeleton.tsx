import {PRODUCT_IMAGE_ASPECT_RATIO} from '~/lib/constants';

export function ProductItemSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <div
        className="bg-neutralLightest relative overflow-hidden"
        style={{aspectRatio: PRODUCT_IMAGE_ASPECT_RATIO}}
      />

      <div className="w-full max-w-[280px] relative overflow-hidden bg-neutralLightest h-6 mt-3" />

      <div className="w-20 relative overflow-hidden bg-neutralLightest h-5 mt-1" />

      <div className="w-8 relative overflow-hidden bg-neutralLightest h-5 mt-1" />
    </div>
  );
}

ProductItemSkeleton.displayName = 'ProductItemSkeleton';
