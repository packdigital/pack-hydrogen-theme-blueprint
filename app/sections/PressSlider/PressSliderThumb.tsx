import clsx from 'clsx';

import {Image} from '~/components/Image';

import type {PressSliderThumbProps} from './PressSlider.types';

const LOGO_WIDTH = 128;
const DEFAULT_LOGO_ASPECT_RATIO = 3.2; // Default fallback for logos (width/height)

export function PressSliderThumb({
  alt,
  image,
  isActive,
  onClick,
}: PressSliderThumbProps) {
  // Calculate aspect ratio for proper height calculation
  const imageAspectRatio =
    image?.aspectRatio ||
    (image?.width && image?.height ? image.width / image.height : null);
  const aspectRatio = imageAspectRatio || DEFAULT_LOGO_ASPECT_RATIO;
  const calculatedHeight = Math.round(LOGO_WIDTH / aspectRatio);

  return (
    <div className="relative mx-auto flex w-full max-w-32 justify-center pb-5">
      <button
        aria-label={alt}
        className="relative w-full overflow-hidden"
        onClick={onClick}
        style={{aspectRatio}}
        type="button"
      >
        {image?.url && (
          <Image
            data={{
              altText: image.altText || alt,
              url: image.url,
              width: image.width || LOGO_WIDTH,
              height: image.height || calculatedHeight,
            }}
            width={`${LOGO_WIDTH}px`}
            aspectRatio={`${aspectRatio}/1`}
            className={clsx(
              'bg-transparent transition',
              isActive ? 'opacity-100' : 'opacity-30',
            )}
            style={{aspectRatio}}
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
