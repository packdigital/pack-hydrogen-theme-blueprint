import type {AspectRatio, I18nLocale} from './types';

/* Ensure updating this ratio as needed.  */
/* Required format is 'width/height' */
export const PRODUCT_IMAGE_ASPECT_RATIO: AspectRatio =
  '3/4'; /* Ensure this is equivalent to product-image-aspect-ratio in app.css */

export const PROMOBAR_HEIGHT_MOBILE = 48; /* Ensure this number (px) is equivalent to --promobar-height-mobile in app.css */
export const PROMOBAR_HEIGHT_DESKTOP = 48; /* Ensure this number (px) equivalent to --promobar-height-desktop in app.css */

export const DEFAULT_LOCALE: I18nLocale = Object.freeze({
  label: 'United States (USD $)',
  language: 'EN',
  country: 'US',
  currency: 'USD',
  pathPrefix: '',
});

export const COLOR_OPTION_NAME = 'Color' as const;

export const PRICE_FILTER_ID = 'filter.v.price' as const;

export const LOGGED_OUT_REDIRECT_TO = '/account/login' as const;

export const LOGGED_IN_REDIRECT_TO = '/account/orders' as const;
