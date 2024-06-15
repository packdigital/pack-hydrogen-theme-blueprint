import {json} from '@shopify/remix-oxygen';
import type {ActionFunctionArgs} from '@shopify/remix-oxygen';

/*
 * By default, marketing integration is done through Klaviyo. For any other
 * marketing platform, create a new api route around its API documentation.
 */

type Data = {data: Record<string, any>[]; errors: Record<string, any>[]};

interface CheckIfEmailIsInListReturn {
  status: number;
  isSubscribed: boolean;
  email: string | null;
  error: string | null;
}

const checkIfEmailIsInList = async ({
  body,
  platformKey,
  platformVersion,
}: {
  body: FormData;
  platformKey: string;
  platformVersion: string;
}): Promise<CheckIfEmailIsInListReturn> => {
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
        revision: platformVersion,
        Authorization: `Klaviyo-API-Key ${platformKey}`,
      },
    };
    const response = await fetch(endpoint, options);
    const data: Data = await response.json();
    const attributes = data?.data?.[0]?.attributes;
    const isSubscribed =
      attributes?.subscriptions?.email?.marketing?.consent === 'SUBSCRIBED';

    if (data?.errors?.[0]) {
      throw new Error(data.errors[0].detail);
    }

    return {
      status: 200,
      isSubscribed: isSubscribed || false,
      email,
      error: null,
    };
  } catch (error) {
    console.error('checkIfEmailIsInList:error', error.message);
    return {
      status: 404,
      isSubscribed: false,
      email: null,
      error: error.message,
    };
  }
};

interface CheckIfPhoneNumberIsInListReturn {
  status: number;
  isSubscribed: boolean;
  phone: string | null;
  error: string | null;
}

const checkIfPhoneNumberIsInList = async ({
  body,
  platformKey,
  platformVersion,
}: {
  body: FormData;
  platformKey: string;
  platformVersion: string;
}): Promise<CheckIfPhoneNumberIsInListReturn> => {
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
        revision: platformVersion,
        Authorization: `Klaviyo-API-Key ${platformKey}`,
      },
    };
    const response = await fetch(endpoint, options);
    const data: Data = await response.json();
    const attributes = data?.data?.[0]?.attributes;
    const isSubscribed =
      attributes?.subscriptions?.sms?.marketing?.consent === 'SUBSCRIBED';

    if (data?.errors?.[0]) {
      throw new Error(data.errors[0].detail);
    }

    return {
      status: 200,
      isSubscribed: isSubscribed || false,
      phone: phone_number,
      error: null,
    };
  } catch (error) {
    console.error('checkIfEmailIsInList:error', error.message);
    return {
      status: 404,
      isSubscribed: false,
      phone: null,
      error: error.message,
    };
  }
};

export interface SubscribeEmailOrPhoneToListReturn {
  status: number;
  isAlreadySubscribed: boolean;
  message: string;
  error: string | null;
  email?: string | null;
  phone?: string | null;
  submittedAt: string;
}

const subscribeEmailOrPhoneToList = async ({
  body,
  platformKey,
  platformVersion,
}: {
  body: FormData;
  platformKey: string;
  platformVersion: string;
}): Promise<SubscribeEmailOrPhoneToListReturn> => {
  try {
    const listId = String(body?.get('listId') || '');
    const email = String(body?.get('email') || '');
    const phone = String(body?.get('phone') || '');

    if (!listId) {
      throw new Error('`listId` is required.');
    }
    if (!email && !phone) {
      throw new Error('`email` or `phone` is required.');
    }

    /* Check if email + phone, email, or phone are already subscribed */
    if (email && phone) {
      const {isSubscribed: emailIsSubscribed} = await checkIfEmailIsInList({
        body,
        platformKey,
        platformVersion,
      });
      const {isSubscribed: phoneIsSubscribed} =
        await checkIfPhoneNumberIsInList({
          body,
          platformKey,
          platformVersion,
        });
      /* if both email and phone are present in the body, only return early if
       * both email and phone are already subscribed */
      if (emailIsSubscribed && phoneIsSubscribed) {
        return {
          status: 200,
          isAlreadySubscribed: true,
          message: 'Email and phone number are already subscribed.',
          error: null,
          email,
          phone,
          submittedAt: new Date().toISOString(),
        };
      }
    } else if (email) {
      const {isSubscribed} = await checkIfEmailIsInList({
        body,
        platformKey,
        platformVersion,
      });
      if (isSubscribed) {
        return {
          status: 200,
          isAlreadySubscribed: true,
          message: 'Email is already subscribed.',
          error: null,
          email,
          phone,
          submittedAt: new Date().toISOString(),
        };
      }
    } else if (phone) {
      const {isSubscribed} = await checkIfPhoneNumberIsInList({
        body,
        platformKey,
        platformVersion,
      });
      if (isSubscribed) {
        return {
          status: 200,
          isAlreadySubscribed: true,
          message: 'Phone number is already subscribed.',
          error: null,
          email,
          phone,
          submittedAt: new Date().toISOString(),
        };
      }
    }

    let phone_number;
    if (phone) {
      phone_number = phone.startsWith('+')
        ? `+${phone.slice(1).replaceAll(/[^\d]/g, '')}`
        : `+1${phone.replaceAll(/[^\d]/g, '')}`;
    }
    const smsConsent = Boolean(body?.get('smsConsent'));

    const endpoint =
      'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/';

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        revision: platformVersion,
        'content-type': 'application/json',
        Authorization: `Klaviyo-API-Key ${platformKey}`,
      },
      body: JSON.stringify({
        data: {
          type: 'profile-subscription-bulk-create-job',
          attributes: {
            profiles: {
              data: [
                {
                  type: 'profile',
                  attributes: {
                    ...(email ? {email} : null),
                    ...(phone_number ? {phone_number} : null),
                    subscriptions: {
                      ...(email
                        ? {email: {marketing: {consent: 'SUBSCRIBED'}}}
                        : null),
                      ...(phone_number && smsConsent
                        ? {sms: {marketing: {consent: 'SUBSCRIBED'}}}
                        : null),
                    },
                  },
                },
              ],
            },
          },
          relationships: {list: {data: {type: 'list', id: listId}}},
        },
      }),
    };

    const response = await fetch(endpoint, options);

    if (response.ok) {
      return {
        status: 200,
        isAlreadySubscribed: false,
        message: email
          ? 'Thank you for signing up!'
          : phone
          ? 'Thank you for signing up!'
          : '',
        error: null,
        email: email || null,
        phone: phone || null,
        submittedAt: new Date().toISOString(),
      };
    } else {
      const data: Record<string, any> = await response.json();
      const detail = data?.errors?.[0]?.detail;
      return {
        status: 400,
        isAlreadySubscribed: false,
        message: 'Something went wrong. Please try again later.',
        error: `/api/klaviyo:subscribeEmailOrPhoneToList:error: ${
          detail || 'Something went wrong'
        }\ndata: ${JSON.stringify(data)}`,
        email: email || null,
        phone: phone || null,
        submittedAt: new Date().toISOString(),
      };
    }
  } catch (error) {
    console.error('subscribeEmailOrPhoneToList:error', error.message);
    return {
      status: 500,
      isAlreadySubscribed: false,
      message: 'Something went wrong. Please try again later.',
      error: `/api/klaviyo:subscribeEmailOrPhoneToList:error: ${error.message}`,
      email: null,
      phone: null,
      submittedAt: new Date().toISOString(),
    };
  }
};

export async function action({request, context}: ActionFunctionArgs) {
  let body;
  try {
    body = await request.formData();
  } catch (error) {}
  const action = String(body?.get('action') || '');

  const actions: Record<string, any> = {
    subscribeEmailOrPhoneToList,
    checkIfEmailIsInList,
    checkIfPhoneNumberIsInList,
  };
  const marketingAction = actions[action];

  if (!marketingAction) {
    return json(
      {error: `/api/klaviyo: Unsupported action \`${action}\``},
      {status: 400},
    );
  }

  const env = context.env as Record<string, any>;
  // private key env must be set locally and through the Hydrogen app
  const platformKey = env.PRIVATE_KLAVIYO_API_KEY;
  const platformVersion =
    (env.PUBLIC_KLAIVYO_REVISION?.startsWith('v')
      ? env.PUBLIC_KLAIVYO_REVISION.slice(1)
      : env.PUBLIC_KLAIVYO_REVISION) || '2024-05-15';

  const data = await marketingAction({body, platformKey, platformVersion});

  return json({...data}, {status: data?.status || 500});
}
