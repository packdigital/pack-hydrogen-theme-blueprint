import clsx from 'clsx';

import {Image} from '~/components/Image';

import type {PressSliderThumbProps} from './PressSlider.types';

export function PressSliderThumb({
  alt,
  image,
  isActive,
  onClick,
}: PressSliderThumbProps) {
  return (
    <div className="relative mx-auto flex w-full max-w-32 justify-center pb-5">
      <button
        aria-label={alt}
        className="relative w-full overflow-hidden"
        onClick={onClick}
        style={{aspectRatio: image?.aspectRatio}}
        type="button"
      >
        {image?.url && (
          <Image
            data={{
              altText: image.altText || alt,
              url: image.url,
              width: image.width,
              height: image.height,
            }}
            width="128px"
            className={clsx(
              'bg-transparent transition',
              isActive ? 'opacity-100' : 'opacity-30',
            )}
          />
        )}
      </button>

      <div
        className={clsx(
          'absolute bottom-0 left-0 h-px w-full origin-center bg-current transition',
          isActive ? 'scale-100' : 'scale-0',
        )}
      />
    </div>
  );
}

PressSliderThumb.displayName = 'PressSliderThumb';
