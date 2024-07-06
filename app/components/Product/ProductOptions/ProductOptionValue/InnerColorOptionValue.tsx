import {useMemo} from 'react';

import {Image} from '~/components';
import {isLightHexColor} from '~/lib/utils';
import type {Swatch} from '~/lib/types';

interface InnerColorOptionValueProps {
  isAvailable: boolean;
  isDisabled: boolean;
  isSelected: boolean;
  swatch?: Swatch | null;
  value: string;
}

export function InnerColorOptionValue({
  isAvailable,
  isDisabled,
  isSelected,
  swatch,
  value,
}: InnerColorOptionValueProps) {
  const isLightColor = useMemo(() => {
    return isLightHexColor(swatch?.color);
  }, [swatch?.color]);

  const validClass = !isDisabled
    ? 'md:group-hover/color:border-text'
    : 'cursor-not-allowed';
  const selectedClass = isSelected ? 'border-text' : '';
  const unavailableClass = !isAvailable
    ? `after:h-px after:w-[150%] after:rotate-[135deg] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 overflow-hidden ${
        isLightColor ? 'after:bg-black' : 'after:bg-white'
      }`
    : '';

  return (
    <div
      className={`relative flex size-8 items-center justify-center overflow-hidden rounded-[50%] border border-border transition ${validClass} ${unavailableClass} ${selectedClass}`}
      style={{backgroundColor: swatch?.color}}
    >
      {swatch?.image?.src && (
        <Image
          data={{
            altText: value,
            url: swatch.image.src,
            width: swatch.image.width,
            height: swatch.image.height,
          }}
          aspectRatio="1/1"
          width="32"
          className="media-fill"
          isStatic
        />
      )}

      <div
        className={`media-fill rounded-[50%] border-white transition-[border-width] duration-100 ${
          isSelected ? 'border-[3px]' : 'border-0'
        }`}
      />
    </div>
  );
}

InnerColorOptionValue.displayName = 'InnerColorOptionValue';
