import type {
  ActionProps,
  CheckIfEmailIsInListReturn,
  Data,
} from './klaviyo.types';

export const checkIfEmailIsInList = async ({
  body,
  privateApiKey,
  apiVersion,
}: ActionProps): Promise<CheckIfEmailIsInListReturn> => {
  try {
    const listId = String(body?.get('listId') || '');
    const email = String(body?.get('email') || '');

    if (!listId) throw new Error('`listId` is required.');
    if (!email) throw new Error('`email` is required.');

    const endpoint = `https://a.klaviyo.com/api/lists/${listId}/profiles/?additional-fields[profile]=subscriptions&fields[profile]=email,subscriptions.email.marketing.consent&filter=equals${encodeURIComponent(
      `(email,"${email}")`,
    )}`;

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        revision: apiVersion,
        Authorization: `Klaviyo-API-Key ${privateApiKey}`,
      },
    };
    const response = await fetch(endpoint, options);
    const data: Data = await response.json();
    const attributes = data?.data?.[0]?.attributes;
    const isSubscribed =
      attributes?.subscriptions?.email?.marketing?.consent === 'SUBSCRIBED';

    if (data?.errors?.length) {
      throw new Error(data.errors.map(({detail}) => detail).join(', '));
    }

    return {
      status: 200,
      isSubscribed: isSubscribed || false,
      email,
      error: null,
    };
  } catch (error) {
    const errorMessage = `/api/klaviyo: checkIfEmailIsInList:error: ${
      error instanceof Error ? error.message : 'Unknown error'
    }`;
    console.error(errorMessage);
    return {
      status: 404,
      isSubscribed: false,
      email: null,
      error: errorMessage,
    };
  }
};
