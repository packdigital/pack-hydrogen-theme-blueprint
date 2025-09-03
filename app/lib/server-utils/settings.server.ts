import type {AppLoadContext} from '@shopify/remix-oxygen';

import {SITE_SETTINGS_QUERY} from '~/data/graphql/pack/settings';
import {LAYOUT_QUERY} from '~/data/graphql/storefront/shop';
import type {RootSiteSettings} from '~/lib/types';

export const getShop = async (context: AppLoadContext) => {
  const layout = await context.storefront.query(LAYOUT_QUERY, {
    cache: context.storefront.CacheShort(),
  });
  return layout?.shop;
};

export const getSiteSettings = async (
  context: AppLoadContext,
): Promise<RootSiteSettings> => {
  const {pack, storefront} = context;
  return pack.query(SITE_SETTINGS_QUERY, {
    variables: {
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
    cache: storefront.CacheLong(),
  }) as RootSiteSettings;
};

export const getPrimaryDomain = ({
  context,
  request,
}: {
  context: AppLoadContext;
  request?: Request;
}) => {
  const PRIMARY_DOMAIN = context.env.PRIMARY_DOMAIN;
  let primaryDomainOrigin = '';
  if (PRIMARY_DOMAIN) {
    try {
      primaryDomainOrigin = new URL(PRIMARY_DOMAIN).origin;
    } catch (error) {}
  }
  if (!primaryDomainOrigin && request) {
    primaryDomainOrigin = new URL(request.url).origin;
  }
  return primaryDomainOrigin;
};

export const getPublicEnvs = async ({
  context,
  request,
}: {
  context: AppLoadContext;
  request?: Request;
}): Promise<Record<string, string>> => {
  const PRIMARY_DOMAIN = getPrimaryDomain({context, request});

  const publicEnvs = Object.entries({...context.env}).reduce(
    (acc: any, [key, value]) => {
      if (key.startsWith('PUBLIC_')) acc[key] = value;
      return acc;
    },
    {},
  );

  return {...publicEnvs, PRIMARY_DOMAIN};
};
