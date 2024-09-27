import type {ProductOptionValue} from '@shopify/hydrogen-react/storefront-api-types';

import {Image} from '~/components';
import type {SwatchesMap} from '~/lib/types';

interface ColorVariantOptionProps {
  color: ProductOptionValue;
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
  const isActive = color.name === selectedVariantColor;

  /* Swatch color/image from Shopify takes priority over CMS */
  const swatchFromCms = swatchesMap?.[color.name.toLowerCase().trim()];
  const colorFromCms = swatchFromCms?.color;
  const colorFromShopify = color.swatch?.color;
  const optionColor = colorFromShopify || colorFromCms;
  const imageFromCms = swatchFromCms?.image;
  const imageFromShopify = color.swatch?.image?.previewImage;
  const optionImage = imageFromShopify || imageFromCms;
  const optionImageUrl = imageFromShopify?.url || imageFromCms?.src;

  return (
    <div className="group/color relative">
      <button
        aria-label={`Select ${color.name} color variant`}
        className={`relative flex size-4 items-center justify-center overflow-hidden rounded-[50%] border border-border transition md:hover:border-text ${
          isActive ? 'border-text' : ''
        }`}
        onClick={onClick}
        style={{backgroundColor: optionColor}}
        type="button"
      >
        {optionImageUrl && (
          <Image
            data={{
              altText: color.name,
              url: optionImageUrl,
              width: optionImage?.width,
              height: optionImage?.height,
            }}
            width="24"
            aspectRatio="1/1"
            className="media-fill"
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
          {color.name}
        </p>
      )}
    </div>
  );
}

ColorVariantOption.displayName = 'ColorVariantOption';
