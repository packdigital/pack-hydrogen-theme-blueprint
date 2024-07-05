import {countries} from '~/data/countries';

import type {I18nLocale} from '../types';

export const pathWithLocalePrefix = (pathname = '', pathPrefix = '') => {
  if (!pathname || !pathPrefix) return pathname;
  return `${pathPrefix}${pathname.startsWith('/') ? pathname : '/' + pathname}`;
};

export const pathWithoutLocalePrefix = (pathname = '', pathPrefix = '') => {
  if (!pathname) return pathname;
  // if prefix is provided, remove it from string directly
  if (pathPrefix) {
    return pathname.replace(
      pathPrefix.startsWith('/') ? pathPrefix : `/${pathPrefix}`,
      '',
    );
  }
  // otherwise remove locale based on `/aa-bb` pattern
  return pathname.replace(/^\/[a-zA-Z]{2}-[a-zA-Z]{2}/, '');
};

export function getLocaleFromRequest(request: Request): I18nLocale {
  const url = new URL(request.url);
  const firstPathPart =
    '/' + url.pathname.substring(1).split('/')[0].toLowerCase();

  return countries[firstPathPart]
    ? {
        ...countries[firstPathPart],
        pathPrefix: firstPathPart,
      }
    : {
        ...countries['default'],
        pathPrefix: '',
      };
}

export function parseAsCurrency(value: number, locale: I18nLocale) {
  const price = new Intl.NumberFormat(locale.language + '-' + locale.country, {
    style: 'currency',
    currency: locale.currency,
  }).format(value);
  // Remove trailing zeros
  return price.endsWith('.00') || price.endsWith(',00')
    ? price.slice(0, -3)
    : price;
}
