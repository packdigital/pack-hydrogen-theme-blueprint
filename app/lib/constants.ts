import type {AspectRatio, I18nLocale} from './types';

export const PRODUCT_IMAGE_ASPECT_RATIO: AspectRatio = '3/4';

export const DEFAULT_LOCALE: I18nLocale = Object.freeze({
  label: 'United States (USD $)',
  language: 'EN',
  country: 'US',
  currency: 'USD',
  pathPrefix: '',
});

export const COLOR_OPTION_NAME = 'Color' as const;

export const PRICE_FILTER_ID = 'filter.v.price' as const;
