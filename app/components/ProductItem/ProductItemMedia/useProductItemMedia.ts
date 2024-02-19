import {useMemo} from 'react';
import type {
  MediaEdge,
  MediaImage,
} from '@shopify/hydrogen/storefront-api-types';

import {COLOR_OPTION_NAME} from '~/lib/constants';

import type {ProductItemMediaProps} from './ProductItemMedia';

export function useProductItemMedia({
  hasGrouping,
  selectedProduct,
  selectedVariant,
}: ProductItemMediaProps): {
  primaryMedia: MediaEdge['node'] | undefined;
  hoverMedia: MediaEdge['node'] | undefined;
} {
  const colorOptions = useMemo(() => {
    return selectedProduct?.options?.find(
      (option) => option.name === COLOR_OPTION_NAME,
    )?.values;
  }, [selectedProduct?.id]);

  const hasMultiColorsNotFromGroup =
    !hasGrouping && colorOptions && colorOptions.length > 1;

  /*
   * if multi color variants from same product, create table pairing color w/ any media matching alt tag
   * IMPORTANT: Increase the default number of media items fetched for a product item to ensure proper mapping
   * see: /data/product.queries.ts -> PRODUCT_ITEM_FRAGMENT
   */
  const mediaMapByAltText = useMemo((): Record<
    string,
    MediaEdge['node'][]
  > | null => {
    if (!hasMultiColorsNotFromGroup || !selectedProduct) return null;

    const colorKeys = colorOptions.map((color) => color.toLowerCase());

    return colorOptions.reduce((acc, color) => {
      const medias = selectedProduct.media.nodes as MediaEdge['node'][];
      const colorKey = color.toLowerCase();
      const firstMediaIndex = medias.findIndex((item) => {
        const alt = (item.alt || item.previewImage?.altText)
          ?.trim()
          .toLowerCase();
        return alt === colorKey && colorKeys.includes(alt);
      });
      if (firstMediaIndex < 0) {
        return {...acc, [color]: null};
      }
      const secondMedia = medias[firstMediaIndex + 1];
      const secondMediaAlt = (
        secondMedia?.alt || secondMedia?.previewImage?.altText
      )
        ?.trim()
        .toLowerCase();
      const secondMediaIndex =
        secondMediaAlt === colorKey && colorKeys.includes(secondMediaAlt)
          ? firstMediaIndex + 1
          : -1;
      const media = [medias[firstMediaIndex], medias[secondMediaIndex]];
      return {...acc, [color]: media};
    }, {});
  }, [selectedProduct?.id]);

  const selectedMedia = useMemo(() => {
    // if multi color variants from same product
    if (hasMultiColorsNotFromGroup && selectedVariant) {
      const color =
        selectedVariant?.selectedOptions?.find(
          (option) => option.name === COLOR_OPTION_NAME,
        )?.value || '';
      // use media with color name as alt text if any matches
      if (mediaMapByAltText?.[color]?.[0]) {
        return mediaMapByAltText[color];
      }
      const variantImage = selectedVariant?.image;
      // if no variant image, use first two media
      if (!variantImage) return selectedProduct?.media?.nodes?.slice(0, 2);
      // if variant image, use it as primary media
      const variantMedia = {
        mediaContentType: 'IMAGE',
        previewImage: variantImage,
      } as MediaImage;
      return [variantMedia];
    }
    // otherwise, use first two media
    return selectedProduct?.media?.nodes?.slice(0, 2);
  }, [
    hasMultiColorsNotFromGroup,
    mediaMapByAltText,
    selectedProduct?.id,
    selectedVariant?.id,
  ]);

  return {
    primaryMedia: selectedMedia?.[0],
    hoverMedia: selectedMedia?.[1],
  };
}
