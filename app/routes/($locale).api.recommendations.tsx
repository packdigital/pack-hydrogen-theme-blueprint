import {json} from '@shopify/remix-oxygen';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {PRODUCT_RECOMMENDATIONS_QUERY} from '~/data/queries';

// docs: https://shopify.dev/docs/api/storefront/latest/queries/productRecommendations

export async function loader({request, context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const productId = String(searchParams.get('productId') || '');
  const intent = String(searchParams.get('intent') || 'RELATED');

  if (!productId)
    return json(
      {products: null, errors: ['Missing product `productId` parameter']},
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
