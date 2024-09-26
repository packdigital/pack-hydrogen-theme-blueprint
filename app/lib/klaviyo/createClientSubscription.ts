import {checkIfEmailIsInList} from './checkIfEmailIsInList';
import {checkIfPhoneNumberIsInList} from './checkIfPhoneNumberIsInList';
import type {
  ActionProps,
  CreateClientSubscriptionReturn,
} from './klaviyo.types';

/*
 * Uses a client side api endpoint to create/update profile with custom
 * properties and adds them to a list
 */

export const createClientSubscription = async ({
  body,
  privateApiKey,
  publicApiKey,
  apiVersion,
}: ActionProps): Promise<CreateClientSubscriptionReturn> => {
  try {
    const listId = String(body?.get('listId'));
    const email = String(body?.get('email') || '');
    const phone = String(body?.get('phone') || '');
    const source = String(body?.get('source') || 'web');
    const properties = body?.get('properties') as string;

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
        privateApiKey,
        apiVersion,
      });
      const {isSubscribed: phoneIsSubscribed} =
        await checkIfPhoneNumberIsInList({
          body,
          privateApiKey,
          apiVersion,
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
        privateApiKey,
        apiVersion,
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
        privateApiKey,
        apiVersion,
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

    const smsConsent = Boolean(body?.get('smsConsent'));

    const endpoint = `https://a.klaviyo.com/client/subscriptions/?company_id=${publicApiKey}`;

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        revision: apiVersion,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          type: 'subscription',
          attributes: {
            custom_source: source,
            profile: {
              data: {
                type: 'profile',
                attributes: {
                  ...(email ? {email} : null),
                  ...(phone && smsConsent ? {phone_number: phone} : null),
                  properties: properties ? JSON.parse(properties) : {},
                },
              },
            },
          },
          relationships: {
            list: {data: {type: 'list', id: listId}},
          },
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
        error: `/api/klaviyo: createClientSubscription:error: ${
          detail || 'Something went wrong'
        }\ndata: ${JSON.stringify(data)}`,
        email: email || null,
        phone: phone || null,
        submittedAt: new Date().toISOString(),
      };
    }
  } catch (error) {
    const errorMessage = `/api/klaviyo: createClientSubscription:error: ${
      error instanceof Error ? error.message : 'Unknown error'
    }`;
    console.error(errorMessage);
    return {
      status: 500,
      isAlreadySubscribed: false,
      message: 'Something went wrong. Please try again later.',
      error: errorMessage,
      email: null,
      phone: null,
      submittedAt: new Date().toISOString(),
    };
  }
};
