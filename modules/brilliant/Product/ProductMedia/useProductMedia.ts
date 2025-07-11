import type {
  MediaEdge,
  MediaImage,
} from '@shopify/hydrogen/storefront-api-types';
import {useMemo} from 'react';

import {ADDITIONAL_VARIANT_NAMES} from '../additionalVariantNames';

import {COLOR_OPTION_NAME} from '~/lib/constants';
import type {ProductWithGrouping, SelectedVariant} from '~/lib/types';

type Media = MediaEdge['node'];

interface UseProductMediaProps {
  product: ProductWithGrouping;
  selectedVariant: SelectedVariant;
}

interface UseProductMediaReturn {
  initialIndex: number;
  maybeHasImagesByVariant: boolean;
  media: Media[];
}

export function useProductMedia({
  product,
  selectedVariant,
}: UseProductMediaProps): UseProductMediaReturn {
  const colorOptions = useMemo(() => {
    return product.options?.find(
      (option) =>
        option.name === COLOR_OPTION_NAME ||
        !!ADDITIONAL_VARIANT_NAMES.find((v) => v === option.name),
    )?.optionValues;
  }, [product.options]);

  const hasMultiColorsNotFromGroup =
    !product.grouping && colorOptions && colorOptions.length > 1;

  // if multi color variants from same product, create table pairing color w/ any media matching alt tag
  const mediaMapByAltText = useMemo((): Record<string, Media[]> | null => {
    if (!hasMultiColorsNotFromGroup) return null;

    const colorKeys = colorOptions.map((color) => color.name.toLowerCase());

    return colorOptions.reduce((acc, color) => {
      const medias = product.media.nodes as Media[];
      const colorKey = color.name.toLowerCase();
      const colorMedias = medias.filter((item) => {
        const alt = (
          item.alt ||
          (item as MediaImage).image?.altText ||
          item.previewImage?.altText
        )
          ?.trim()
          .toLowerCase();
        return alt === colorKey && colorKeys.includes(alt);
      });
      return {...acc, [color.name]: colorMedias.length ? colorMedias : null};
    }, {});
  }, [colorOptions, hasMultiColorsNotFromGroup, product.media.nodes]);

  const mediaFromAltText = useMemo((): Media[] | null => {
    if (hasMultiColorsNotFromGroup && selectedVariant) {
      const color =
        selectedVariant?.selectedOptions?.find(
          (option) => option.name === COLOR_OPTION_NAME,
        )?.value || '';
      if (mediaMapByAltText?.[color]) {
        return mediaMapByAltText[color];
      }
    }
    return null;
  }, [hasMultiColorsNotFromGroup, mediaMapByAltText, selectedVariant]);

  const media = useMemo(() => {
    return mediaFromAltText || product.media.nodes || [];
  }, [mediaFromAltText, product.media.nodes]);

  const initialIndex = useMemo(() => {
    if (!hasMultiColorsNotFromGroup || !selectedVariant || mediaFromAltText)
      return 0;
    const mediaIndex = product.media.nodes.findIndex(
      ({previewImage}) => previewImage?.url === selectedVariant?.image?.url,
    );
    return mediaIndex >= 0 ? mediaIndex : 0;
  }, [
    hasMultiColorsNotFromGroup,
    selectedVariant,
    mediaFromAltText,
    product.media.nodes,
  ]);

  const maybeHasImagesByVariant =
    !!hasMultiColorsNotFromGroup && !mediaFromAltText;

  return {initialIndex, maybeHasImagesByVariant, media};
}
