import {json} from '@shopify/remix-oxygen';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {getMetafields} from '~/lib/utils';
import {PRODUCT_ITEM_QUERY} from '~/data/queries';

export async function loader({request, context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const handle = String(searchParams.get('handle') || '');

  if (!handle)
    return json(
      {product: null, errors: ['Missing `handle` parameter']},
      {status: 400},
    );

  /* Product metafields query by metafieldQueries */
  const metafieldQueries = String(searchParams.get('metafieldQueries') || '');

  if (metafieldQueries) {
    let parsedMetafields: {key: string; namespace: string}[] = [];
    try {
      parsedMetafields = JSON.parse(metafieldQueries);
    } catch (error) {
      return json(
        {metafields: null, errors: ['Invalid `metafieldQueries` parameter']},
        {status: 400},
      );
    }
    const metafields = await getMetafields(context, {
      handle,
      metafieldQueries: parsedMetafields,
    });
    return json({metafields});
  }

  /* Product query by handle */
  const {product} = await storefront.query(PRODUCT_ITEM_QUERY, {
    variables: {
      handle,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
    cache: storefront.CacheShort(),
  });

  return json({product});
}
