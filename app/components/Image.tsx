import {forwardRef} from 'react';
import {Image as HydrogenImage} from '@shopify/hydrogen-react';
import clsx from 'clsx';

import type {AspectRatio} from '~/lib/types';

type ImageProps = React.ComponentProps<typeof HydrogenImage> & {
  aspectRatio?: AspectRatio | undefined;
  withLoadingAnimation?: boolean;
  withBackgroundColor?: boolean;
};

export const Image = forwardRef(
  (
    {
      aspectRatio,
      className,
      data,
      width,
      withLoadingAnimation = true, // adds a loading shimmer animation if data.url is undefined
      withBackgroundColor = true, // adds a placeholder background color before image loads
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
        className={clsx(
          'object-cover',
          withBackgroundColor ? 'bg-neutralLightest' : 'bg-transparent',
          className,
        )}
        {...props}
      />
    ) : (
      <div
        ref={ref}
        className={clsx(
          'relative overflow-hidden bg-neutralLightest',
          className,
        )}
        style={{aspectRatio, width}}
      >
        {withLoadingAnimation && <div className="loading-shimmer opacity-60" />}
      </div>
    );
  },
);

Image.displayName = 'Image';
