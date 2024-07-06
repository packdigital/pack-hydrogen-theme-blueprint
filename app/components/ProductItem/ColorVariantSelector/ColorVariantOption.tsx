import {Image} from '~/components';
import type {SwatchesMap} from '~/lib/types';

interface ColorVariantOptionProps {
  color: string;
  enabledColorNameOnHover?: boolean;
  onClick: () => void;
  selectedVariantColor: string | undefined;
  swatchesMap?: SwatchesMap;
}

export function ColorVariantOption({
  color,
  enabledColorNameOnHover,
  onClick,
  selectedVariantColor,
  swatchesMap,
}: ColorVariantOptionProps) {
  const isActive = color === selectedVariantColor;
  const swatch = swatchesMap?.[color?.toLowerCase().trim()];
  const image = swatch?.image?.src;

  return (
    <div className="group/color relative">
      <button
        aria-label={`Select ${color} color variant`}
        className={`relative flex size-4 items-center justify-center overflow-hidden rounded-[50%] border border-border transition md:hover:border-text ${
          isActive ? 'border-text' : ''
        }`}
        onClick={onClick}
        style={{backgroundColor: swatch?.color}}
        type="button"
      >
        {image && (
          <Image
            data={{
              altText: color,
              url: image,
            }}
            width="24"
            aspectRatio="1/1"
            className="media-fill"
            isStatic
          />
        )}

        <div
          className={`media-fill rounded-[50%] border-white transition-[border-width] duration-100 ${
            isActive ? 'border-2' : 'border-0'
          }`}
        />
      </button>

      {enabledColorNameOnHover && (
        <p className="pointer-events-none absolute bottom-[calc(100%+2px)] left-1/4 hidden whitespace-nowrap rounded bg-offWhite px-1 text-2xs leading-[14px] text-mediumDarkGray opacity-0 transition duration-75 md:block group-hover/color:md:opacity-100">
          {color}
        </p>
      )}
    </div>
  );
}

ColorVariantOption.displayName = 'ColorVariantOption';
