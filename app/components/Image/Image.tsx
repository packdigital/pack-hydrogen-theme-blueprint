import {forwardRef} from 'react';
import {Image as HydrogenImage} from '@shopify/hydrogen-react';

import type {AspectRatio} from '~/lib/types';

type ImageProps = React.ComponentProps<typeof HydrogenImage> & {
  aspectRatio?: AspectRatio | undefined;
  withLoadingAnimation?: boolean;
};

export const Image = forwardRef(
  (
    {
      aspectRatio,
      className,
      data,
      width,
      withLoadingAnimation = true, // adds a loading shimmer animation if data.url is undefined
      ...props
    }: ImageProps,
    ref: React.Ref<HTMLImageElement>,
  ) => {
    return data?.url ? (
      <HydrogenImage
        ref={ref}
        data={data}
        aspectRatio={aspectRatio}
        width={width}
        className={`bg-neutralLightest object-cover ${className}`}
        {...props}
      />
    ) : (
      <div
        ref={ref}
        className={`relative overflow-hidden bg-neutralLightest ${className}`}
        style={{aspectRatio, width}}
      >
        {withLoadingAnimation && <div className="loading-shimmer opacity-60" />}
      </div>
    );
  },
);

Image.displayName = 'Image';
