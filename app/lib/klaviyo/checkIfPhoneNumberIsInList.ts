import type {
  ActionProps,
  CheckIfPhoneNumberIsInListReturn,
  Data,
} from './klaviyo.types';

export const checkIfPhoneNumberIsInList = async ({
  body,
  privateApiKey,
  apiVersion,
}: ActionProps): Promise<CheckIfPhoneNumberIsInListReturn> => {
  try {
    const listId = String(body?.get('listId') || '');
    const phone = String(body?.get('phone') || '');

    if (!listId) throw new Error('`listId` is required.');
    if (!phone) throw new Error('`phone` is required.');

    const phone_number = phone.startsWith('+')
      ? `+${phone.slice(1).replaceAll(/[^\d]/g, '')}`
      : `+1${phone.replaceAll(/[^\d]/g, '')}`;

    const endpoint = `https://a.klaviyo.com/api/lists/${listId}/profiles/?additional-fields[profile]=subscriptions&fields[profile]=phone_number,subscriptions.sms.marketing.consent&filter=equals${encodeURIComponent(
      `(phone_number,"${phone_number}")`,
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
      attributes?.subscriptions?.sms?.marketing?.consent === 'SUBSCRIBED';

    if (data?.errors?.length) {
      throw new Error(data.errors.map(({detail}) => detail).join(', '));
    }

    return {
      status: 200,
      isSubscribed: isSubscribed || false,
      phone: phone_number,
      error: null,
    };
  } catch (error) {
    const errorMessage = `/api/klaviyo: checkIfPhoneNumberIsInList:error: ${
      error instanceof Error ? error.message : 'Unknown error'
    }`;
    console.error(errorMessage);
    return {
      status: 404,
      isSubscribed: false,
      phone: null,
      error: errorMessage,
    };
  }
};
