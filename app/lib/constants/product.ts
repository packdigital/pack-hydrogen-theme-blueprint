import type {AspectRatio, MetafieldIdentifier} from '../types';

export const COLOR_OPTION_NAME = 'Color' as const;

export const SIZE_OPTION_NAME = 'Size' as const;

/*
 * Add metafield identifiers to the PRODUCT_METAFIELDS_IDENTIFIERS array to fetch desired metafields for products
 * e.g. [{namespace: 'global', key: 'description'}, {namespace: 'product', key: 'seasonal_colors'}]
 * If namespace is omitted, the app-reserved namespace will be used.
 */
export const PRODUCT_METAFIELDS_IDENTIFIERS = [] as MetafieldIdentifier[];

/* Ensure updating this ratio as needed. Required format is 'width/height' */
export const PRODUCT_IMAGE_ASPECT_RATIO: AspectRatio =
  '3/4'; /* Ensure this is equivalent to product-image-aspect-ratio in app.css */

export const MODAL_PRODUCT_URL_PARAM = 'modalProduct';

export const PRODUCT_MODAL_PANEL = 'product-modal-panel';
