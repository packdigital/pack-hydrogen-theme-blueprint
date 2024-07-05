import {json} from '@shopify/remix-oxygen';
import type {ActionFunctionArgs} from '@shopify/remix-oxygen';

import {
  checkIfEmailIsInList,
  checkIfPhoneNumberIsInList,
  subscribeEmailOrPhoneToList,
  subscribeToBackInStock,
} from '~/lib/klaviyo';

export async function action({request, context}: ActionFunctionArgs) {
  let body;
  try {
    body = await request.formData();
  } catch (error) {}
  const action = String(body?.get('action') || '');

  const actions: Record<string, any> = {
    checkIfEmailIsInList,
    checkIfPhoneNumberIsInList,
    subscribeEmailOrPhoneToList,
    subscribeToBackInStock,
  };
  const klaviyoAction = actions[action];

  if (!klaviyoAction) {
    return json(
      {error: `/api/klaviyo: Unsupported action \`${action}\``},
      {status: 400},
    );
  }

  const env = context.env as Record<string, any>;
  // private key env must be set locally and through the Hydrogen app
  const privateApiKey = env.PRIVATE_KLAVIYO_API_KEY;
  const publicApiKey = env.PUBLIC_KLAVIYO_API_KEY;
  const apiVersion =
    (env.PUBLIC_KLAIVYO_REVISION?.startsWith('v')
      ? env.PUBLIC_KLAIVYO_REVISION.slice(1)
      : env.PUBLIC_KLAIVYO_REVISION) || '2024-05-15';

  const data = await klaviyoAction({
    body,
    privateApiKey,
    publicApiKey,
    apiVersion,
  });

  return json({...data}, {status: data?.status || 500});
}
