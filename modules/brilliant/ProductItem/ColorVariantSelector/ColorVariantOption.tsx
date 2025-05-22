import {useBrilliantColorSwatches} from 'modules/brilliant/hooks/useBrilliantColorSwatches';

import {ColorSwatchColor} from './ColorSwatchColor';

import type {ColorVariantOptionProps} from '~/components/ProductItem/ProductItem.types';

export function ColorVariantOption({
  color,
  enabledColorNameOnHover,
  onClick,
  selectedVariantColor,
  swatchesMap,
}: ColorVariantOptionProps) {
  const {colorSwatch} = useBrilliantColorSwatches({
    colorName: color.name,
  });
  const isActive = color.name === selectedVariantColor;

  /* Swatch color/image from Shopify takes priority over CMS */
  const swatchFromCms = swatchesMap?.[color.name.toLowerCase().trim()];
  const colorFromCms = swatchFromCms?.color;
  const colorFromShopify = color.swatch?.color;
  const optionColor = colorFromShopify || colorFromCms;
  const imageFromCms = swatchFromCms?.image;
  const imageFromShopify = color.swatch?.image?.previewImage;
  const optionImage = imageFromShopify || imageFromCms;
  const optionImageUrl = optionImage?.url;

  return (
    <div className="group/color relative">
      <button
        aria-label={`Select ${color.name} color variant`}
        className={`relative flex size-6 items-center justify-center overflow-hidden rounded-[50%] border border-border transition md:hover:border-text ${
          isActive ? 'border-text' : ''
        }`}
        onClick={onClick}
        style={{backgroundColor: 'none'}}
        type="button"
      >
        {colorSwatch && <ColorSwatchColor colorSwatch={colorSwatch} />}

        <div
          className={`media-fill rounded-[50%] border-white transition-[border-width] duration-100 ${
            isActive ? 'border-2' : 'border-0'
          }`}
        />
      </button>

      <p className=" pointer-events-none absolute bottom-[calc(100%+2px)] left-1/4 hidden whitespace-nowrap rounded border border-primary bg-gray-100 p-2 text-sm leading-[14px] text-gray-900 opacity-0 transition duration-75 md:block group-hover/color:md:opacity-100">
        {color.name}
      </p>
    </div>
  );
}

ColorVariantOption.displayName = 'ColorVariantOption';
