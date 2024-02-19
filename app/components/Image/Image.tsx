import {forwardRef} from 'react';
import {Image as HydrogenImage} from '@shopify/hydrogen-react';

import type {AspectRatio} from '~/lib/types';

type ImageProps = React.ComponentProps<typeof HydrogenImage> & {
  aspectRatio?: AspectRatio | undefined;
  isStatic?: boolean;
  withLoadingAnimation?: boolean;
};

const getPxWidthNum = (width: string | number | undefined) => {
  if (!width) return undefined;
  if (typeof width === 'number') return width;
  if (width.endsWith('rem')) return Number(width.replace('rem', '')) * 16;
  if (width.endsWith('em')) return Number(width.replace('em', '')) * 16;
  return Number(width.replace('px', ''));
};

export const Image = forwardRef(
  (
    {
      aspectRatio,
      className,
      data,
      width: passedWidth,
      isStatic, // sets only 1 srcSet option that is 3x scale
      withLoadingAnimation = true, // adds a loading shimmer animation if data.url is undefined
      ...props
    }: ImageProps,
    ref: React.Ref<HTMLImageElement>,
  ) => {
    let width = passedWidth;
    const isRelativeWidth =
      typeof width === 'string' &&
      (width.endsWith('%') || width.endsWith('vw'));
    if (!isRelativeWidth) {
      width = getPxWidthNum(passedWidth);
    }
    const isPxWidth = typeof width === 'number';

    return data?.url ? (
      <HydrogenImage
        ref={ref}
        data={data}
        aspectRatio={aspectRatio}
        width={width}
        className={`bg-offWhite object-cover ${className}`}
        srcSetOptions={
          isStatic && isPxWidth
            ? {
                intervals: 1,
                startingWidth: Number(width) * 3,
                incrementSize: Number(width) * 3,
                placeholderWidth: Number(width) * 3,
              }
            : {
                intervals: 8,
                startingWidth: 200,
                incrementSize: 400,
                placeholderWidth: 100,
              }
        }
        {...props}
      />
    ) : (
      <div
        ref={ref}
        className={`relative overflow-hidden bg-offWhite ${className}`}
        style={{
          aspectRatio,
          width: isPxWidth ? `${width}px` : width || '100%',
        }}
      >
        {withLoadingAnimation && <div className="loading-shimmer opacity-60" />}
      </div>
    );
  },
);

Image.displayName = 'Image';
