import {json} from '@shopify/remix-oxygen';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {CACHE_LONG} from '~/data/cache';
import {LOCALIZATION_QUERY} from '~/data/queries';

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const localization = await storefront.query(LOCALIZATION_QUERY, {
    variables: {
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
    cache: storefront.CacheLong(),
  });

  return json(
    {
      ...localization,
    },
    {
      headers: {
        'cache-control': CACHE_LONG,
      },
    },
  );
}
