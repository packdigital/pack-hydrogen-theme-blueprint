import type {
  ActionProps,
  SubscribeToBackInStockReturn,
  Data,
} from './klaviyo.types';

export const subscribeToBackInStock = async ({
  body,
  publicApiKey,
  apiVersion,
}: ActionProps): Promise<SubscribeToBackInStockReturn> => {
  try {
    const email = String(body?.get('email') || '');
    const variantId = String(body?.get('variantId') || '');

    if (!email) throw new Error('`email` is required.');
    if (!variantId) throw new Error('`listId` is required.');

    const endpoint = `https://a.klaviyo.com/client/back-in-stock-subscriptions/?company_id=${publicApiKey}`;

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        revision: apiVersion || '2024-06-15',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          type: 'back-in-stock-subscription',
          attributes: {
            channels: ['EMAIL'],
            profile: {
              data: {
                type: 'profile',
                attributes: {
                  email,
                },
              },
            },
          },
          relationships: {
            variant: {
              data: {
                type: 'catalog-variant',
                id: `$shopify:::$default:::${variantId}`,
              },
            },
          },
        },
      }),
    };

    const response = await fetch(endpoint, options);

    if (!response.ok) {
      const data: Data = await response.json();
      if (data.errors?.length) {
        return {
          email,
          status: response.status,
          message: 'Something went wrong. Please try again later.',
          error: `/api/klaviyo: subscribeToBackInStock:error: ${data.errors
            .map((error) => error.detail)
            .join(', ')}`,
          submittedAt: new Date().toISOString(),
        };
      }
    }

    return {
      email,
      status: 200,
      message:
        'Thank you! We will notify you when this product is back in stock.',
      error: null,
      submittedAt: new Date().toISOString(),
    };
  } catch (error) {
    const errorMessage = `/api/klaviyo: subscribeToBackInStock:error: ${
      error instanceof Error ? error.message : 'Unknown error'
    }`;
    console.error(errorMessage);
    return {
      email: null,
      status: 500,
      message: 'Something went wrong. Please try again later.',
      error: errorMessage,
      submittedAt: new Date().toISOString(),
    };
  }
};
