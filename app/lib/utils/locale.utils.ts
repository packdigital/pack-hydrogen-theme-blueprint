import cookieParser from 'cookie';
import type {AppLoadContext} from '@shopify/remix-oxygen';
import type {Localization} from '@shopify/hydrogen/storefront-api-types';

import {countries} from '~/data/countries';
import {DEFAULT_LOCALE} from '~/lib/constants';
import {LOCALIZATION_QUERY} from '~/data/graphql/storefront/shop';

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
    '/' +
    url.pathname.substring(1).split('/')[0].toLowerCase().replace('.data', '');

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

const REDIRECTED_TO_LOCALE_COOKIE = 'redirected_to_locale';
const DEFAULT_DAY_EXPIRES = 7;

export async function redirectLinkToBuyerLocale({
  context,
  request,
}: {
  context: AppLoadContext;
  request: Request;
}): Promise<
  {to: string; options: {headers: Record<string, string>}} | undefined
> {
  const {storefront, oxygen} = context;

  const cookies = cookieParser.parse(request.headers.get('Cookie') || '');
  const redirectedToLocaleCookie = cookies[REDIRECTED_TO_LOCALE_COOKIE];

  // If cookie is already set, do not redirect again
  if (redirectedToLocaleCookie) return undefined;

  const {localization}: {localization: Localization} = await storefront.query(
    LOCALIZATION_QUERY,
    {
      variables: {
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
      cache: storefront.CacheLong(),
    },
  );
  const buyerLocale = localization?.availableCountries?.find((country) => {
    return (
      country.isoCode.toLowerCase() === oxygen.buyer.country?.toLowerCase()
    );
  });

  // If buyer's locale is an available country, redirect to url with correct locale and set cookie
  if (buyerLocale) {
    const {pathname, search} = new URL(request.url);
    let newUrl = '';
    const pathnameWithoutLocale = pathname.replace(
      /^\/[a-zA-Z]{2}-[a-zA-Z]{2}/,
      '',
    );
    if (
      buyerLocale.isoCode.toLowerCase() === DEFAULT_LOCALE.country.toLowerCase()
    ) {
      newUrl = `${pathnameWithoutLocale}${search}`;
    } else {
      newUrl = `/${DEFAULT_LOCALE.language.toLowerCase()}-${buyerLocale.isoCode.toLowerCase()}${pathnameWithoutLocale}${search}`;
    }

    const daysInMs = DEFAULT_DAY_EXPIRES * 24 * 60 * 60 * 1000;
    const expiresAtInMs = Date.now() + daysInMs;
    const expiresAt = new Date(expiresAtInMs).toUTCString();

    return {
      to: newUrl,
      options: {
        headers: {
          'Set-Cookie': `${REDIRECTED_TO_LOCALE_COOKIE}=true; Path=/; Expires=${expiresAt}; SameSite=Lax;`,
        },
      },
    };
  }

  return undefined;
}
