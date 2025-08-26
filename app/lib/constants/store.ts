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

export const LOGGED_IN_PROFILE_REDIRECT_TO = '/account/profile' as const;

export const FROM_ACCOUNT_AUTHORIZATION_KEY =
  'from_account_authorization' as const;

export const LOGGED_IN_COOKIE = '__pack_logged_in' as const;

export const REGISTERED_COOKIE = '__pack_registered' as const;
