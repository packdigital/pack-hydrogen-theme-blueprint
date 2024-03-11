import {json} from '@shopify/remix-oxygen';
import type {ActionFunctionArgs} from '@shopify/remix-oxygen';

import {PRODUCT_RECOMMENDATIONS_QUERY} from '~/data/queries';

// docs: https://shopify.dev/docs/api/storefront/latest/queries/productRecommendations

export async function action({request, context}: ActionFunctionArgs) {
  const {storefront} = context;
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  let body;
  try {
    body = await request.formData();
  } catch (error) {}
  const productId = String(
    body?.get('productId') || searchParams.get('productId') || '',
  );
  const intent = String(
    body?.get('intent') || searchParams.get('intent') || 'RELATED',
  );

  if (!productId)
    return json(
      {products: null, errors: ['Missing product productId']},
      {status: 500},
    );

  const {productRecommendations} = await storefront.query(
    PRODUCT_RECOMMENDATIONS_QUERY,
    {
      variables: {
        productId,
        intent,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
      cache: storefront.CacheShort(),
    },
  );

  return json({productRecommendations});
}
