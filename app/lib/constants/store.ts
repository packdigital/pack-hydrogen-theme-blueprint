import type {I18nLocale} from '../types';

export const DEFAULT_STOREFRONT_API_VERSION = '2025-01';

export const DEFAULT_LOCALE: I18nLocale = Object.freeze({
  label: 'United States (USD $)',
  language: 'EN',
  country: 'US',
  currency: 'USD',
  pathPrefix: '',
});

export const LOGGED_OUT_REDIRECT_TO = '/account/login' as const;

export const LOGGED_IN_REDIRECT_TO = '/account/orders' as const;
