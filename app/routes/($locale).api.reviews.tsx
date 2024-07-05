import {json} from '@shopify/remix-oxygen';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

/*
 * example api call to third party; repurpose as needed
 */
const getProductReviewAggregate = async ({
  productId,
  platformKey,
}: {
  productId: string;
  platformKey: string;
}) => {
  const endpoint = `https://api.example-platform.com/products/${platformKey}/${encodeURIComponent(
    productId,
  )}/review_aggregate`;
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  };
  const response = await fetch(endpoint, options);
  return response.json();
};

export async function loader({request, context}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const action = String(searchParams.get('action') || '');

  const actions: Record<string, any> = {
    getProductReviewAggregate,
  };
  const reviewsAction = actions[action];

  if (!reviewsAction) {
    return json(
      {error: `/api/reviews: Unsupported action \`${action}\``},
      {status: 400},
    );
  }

  const productId = String(searchParams.get('productId') || '');

  if (!productId) {
    return json(
      {error: '/api/reviews: Missing `productId` parameter'},
      {status: 400},
    );
  }

  const env = context.env as Record<string, any>;
  const platformKey = env.PRIVATE_EXAMPLE_PLATFORM_KEY; // replace with actual env key

  const data = await reviewsAction({productId, platformKey});

  if (!data || data.error) {
    return json(
      {error: data.error || '/api/reviews: Something went wrong'},
      {status: 500},
    );
  }

  return json({...data});
}
