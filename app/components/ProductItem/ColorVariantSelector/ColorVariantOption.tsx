import {Image} from '~/components';

interface ColorVariantOptionProps {
  color: string;
  enabledColorNameOnHover?: boolean;
  onClick: () => void;
  selectedVariantColor: string | undefined;
  swatchesMap?: Record<string, string>;
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
  const hasImage = swatch?.startsWith('http');

  return (
    <div className="group/color relative">
      <button
        aria-label={`Select ${color} color variant`}
        className={`relative flex h-4 w-4 items-center justify-center overflow-hidden rounded-[50%] border border-border transition md:hover:border-text ${
          isActive ? 'border-text' : ''
        }`}
        onClick={onClick}
        style={{backgroundColor: swatch}}
        type="button"
      >
        {hasImage && (
          <Image
            data={{
              altText: color,
              url: swatch,
            }}
            width="24"
            aspectRatio="1/1"
            className="media-fill"
            isStatic
          />
        )}

        <div
          className={`media-fill rounded-[50%] border-white transition-[border-width] duration-100 ${
            isActive ? 'border-[2px]' : 'border-[0px]'
          }`}
        />
      </button>

      {enabledColorNameOnHover && (
        <p className="pointer-events-none absolute bottom-[calc(100%+2px)] left-[25%] hidden whitespace-nowrap rounded bg-offWhite px-1 text-2xs leading-[14px] text-mediumDarkGray opacity-0 transition duration-75 md:block group-hover/color:md:opacity-100">
          {color}
        </p>
      )}
    </div>
  );
}

ColorVariantOption.displayName = 'ColorVariantOption';
