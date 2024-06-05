import {json} from '@shopify/remix-oxygen';
import type {ActionFunctionArgs} from '@shopify/remix-oxygen';

/*
 * By default, marketing integration is done through Klaviyo. For any other
 * marketing platform, you must modify the following functions as needed.
 */

interface CheckIfEmailOrPhoneIsInListReturn {
  isSubscribed: boolean;
  email?: string;
  phone?: string;
}

const checkIfEmailOrPhoneIsInList = async ({
  body,
  platformKey,
}: {
  body: FormData;
  platformKey: string;
}): Promise<CheckIfEmailOrPhoneIsInListReturn> => {
  const listId = String(body?.get('listId') || '');
  const email = String(body?.get('email') || '');
  const phone = String(body?.get('phone') || '');

  const endpoint = `https://a.klaviyo.com/api/v2/list/${listId}/get-members?api_key=${platformKey}`;

  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(
      email ? {emails: [email]} : phone ? {phones: [phone]} : {},
    ),
  };
  const response = await fetch(endpoint, options);
  const data: Record<string, string>[] = await response.json();
  return {
    isSubscribed: !!data?.[0]?.created,
    ...(email ? {email} : phone ? {phone} : {}),
  };
};

export interface SubscribeEmailOrPhoneToListReturn {
  status: number;
  isAlreadySubscribed: boolean;
  message: string;
  error: string | null;
  email?: string;
  phone?: string;
  submittedAt: string;
}

const subscribeEmailOrPhoneToList = async ({
  body,
  platformKey,
}: {
  body: FormData;
  platformKey: string;
}): Promise<SubscribeEmailOrPhoneToListReturn> => {
  const {isSubscribed, email, phone} = await checkIfEmailOrPhoneIsInList({
    body,
    platformKey,
  });

  if (isSubscribed) {
    return {
      status: 200,
      isAlreadySubscribed: true,
      message: email
        ? 'Email is already subscribed.'
        : phone
        ? 'Phone number is already subscribed.'
        : '',
      error: null,
      email,
      phone,
      submittedAt: new Date().toISOString(),
    };
  }

  const listId = String(body?.get('listId') || '');
  const smsConsent = Boolean(body?.get('smsConsent'));

  const endpoint = `https://a.klaviyo.com/api/v2/list/${listId}/subscribe?api_key=${platformKey}`;

  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      profiles: email
        ? [{email}]
        : phone
        ? [
            {
              phone_number: phone.startsWith('+')
                ? `+${phone.slice(1).replaceAll(/[^\d]/g, '')}`
                : `+1${phone.replaceAll(/[^\d]/g, '')}`,
              sms_consent: smsConsent,
            },
          ]
        : [],
    }),
  };
  const response = await fetch(endpoint, options);
  const data: Record<string, any>[] | {message?: string; detail?: string} =
    await response.json();

  const isDataArray = Array.isArray(data);
  /* Klaviyo API specific is success logic */
  const success = isDataArray && (!data[0] || !!data[0].id);

  return success
    ? {
        status: 200,
        isAlreadySubscribed: false,
        message: email
          ? 'Thank you for signing up!'
          : phone
          ? 'Thank you for signing up!'
          : '',
        error: null,
        email,
        phone,
        submittedAt: new Date().toISOString(),
      }
    : {
        status: (isDataArray && data?.[0]?.status) || 400,
        isAlreadySubscribed: false,
        message:
          !isDataArray && data?.detail
            ? data.detail
            : 'Something went wrong. Please try again later.',
        error: `/api/marketing:subscribeEmailOrPhoneToList: ${
          (isDataArray && data?.[0]?.detail) ||
          (!isDataArray && (data?.detail || data?.message)) ||
          'Something went wrong.'
        }`,
        email,
        phone,
        submittedAt: new Date().toISOString(),
      };
};

export async function action({request, context}: ActionFunctionArgs) {
  let body;
  try {
    body = await request.formData();
  } catch (error) {}
  const action = String(body?.get('action') || '');

  const actions: Record<string, any> = {
    subscribeEmailOrPhoneToList,
    checkIfEmailOrPhoneIsInList,
  };
  const marketingAction = actions[action];

  if (!marketingAction) {
    return json(
      {error: `/api/marketing: Unsupported action \`${action}\``},
      {status: 400},
    );
  }

  const env = context.env as Record<string, any>;
  // private key env must be set locally and through the Hydrogen app
  const platformKey = env.PRIVATE_KLAVIYO_API_KEY;

  const data = await marketingAction({body, platformKey});

  return json({...data}, {status: data?.status || 500});
}
