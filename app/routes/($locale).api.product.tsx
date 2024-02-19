import {json} from '@shopify/remix-oxygen';
import type {ActionFunctionArgs} from '@shopify/remix-oxygen';

import {getMetafields} from '~/lib/utils';
import {PRODUCT_ITEM_QUERY} from '~/data/queries';

export async function action({request, context}: ActionFunctionArgs) {
  const {storefront} = context;
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  let body;
  try {
    body = await request.formData();
  } catch (error) {}
  const handle = String(
    body?.get('handle') || searchParams.get('handle') || '',
  );

  if (!handle)
    return json({product: null, errors: ['Missing handle']}, {status: 400});

  const metafieldQueries = String(body?.get('metafieldQueries') || '');

  if (metafieldQueries) {
    let parsedMetafields: {key: string; namespace: string}[] = [];
    try {
      parsedMetafields = JSON.parse(metafieldQueries);
    } catch (error) {
      return json(
        {metafields: null, errors: ['Invalid metafieldQueries']},
        {status: 400},
      );
    }
    const metafields = await getMetafields(context, {
      handle,
      metafieldQueries: parsedMetafields,
    });
    return json({metafields});
  }

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
