import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import type {CustomerAccessToken} from '@shopify/hydrogen/storefront-api-types';

import {LOGGED_OUT_REDIRECT_TO, LOGGED_IN_REDIRECT_TO} from '~/lib/constants';

export const validateCustomerAccessToken = async (
  session: LoaderFunctionArgs['context']['session'],
  customerAccessToken?: CustomerAccessToken,
) => {
  let isLoggedIn = false;
  const headers = new Headers();
  if (!customerAccessToken?.accessToken || !customerAccessToken?.expiresAt) {
    return {isLoggedIn, headers};
  }

  const expiresAt = new Date(customerAccessToken.expiresAt).getTime();
  const dateNow = Date.now();
  const customerAccessTokenExpired = expiresAt < dateNow;

  if (customerAccessTokenExpired) {
    session.unset('customerAccessToken');
    headers.append('Set-Cookie', await session.commit());
  } else {
    isLoggedIn = true;
  }

  return {isLoggedIn, headers};
};

export const redirectLinkIfLoggedIn = async ({
  context,
  params,
}: {
  context: ActionFunctionArgs['context'];
  params: ActionFunctionArgs['params'];
}) => {
  const isPreviewModeEnabled = context.pack.isPreviewModeEnabled();
  // only redirect from server if not in customizer
  if (!isPreviewModeEnabled) {
    const customerAccessToken = await context.session.get(
      'customerAccessToken',
    );
    if (customerAccessToken) {
      return params.locale
        ? `/${params.locale}${LOGGED_IN_REDIRECT_TO}`
        : LOGGED_IN_REDIRECT_TO;
    }
  }
  return undefined;
};

export const redirectLinkIfLoggedOut = async ({
  context,
  params,
}: {
  context: ActionFunctionArgs['context'];
  params: ActionFunctionArgs['params'];
}) => {
  const isPreviewModeEnabled = context.pack.isPreviewModeEnabled();
  // only redirect from server if not in customizer
  if (!isPreviewModeEnabled) {
    const customerAccessToken = await context.session.get(
      'customerAccessToken',
    );
    if (!customerAccessToken) {
      return params.locale
        ? `/${params.locale}${LOGGED_OUT_REDIRECT_TO}`
        : LOGGED_OUT_REDIRECT_TO;
    }
  }
  return undefined;
};

const isBrowser = typeof document !== 'undefined';
const SITE_KEY = isBrowser && window.ENV?.PUBLIC_STORE_DOMAIN?.split('.')[0];
const customerAccessTokenKey = `customerAccessToken:${SITE_KEY}`;

export const setCustomerAccessTokenInLocalStorage = (
  customerAccessToken: CustomerAccessToken,
) => {
  if (!isBrowser) return;
  localStorage.setItem(
    customerAccessTokenKey,
    JSON.stringify(customerAccessToken),
  );
};

export const removeCustomerAccessTokenFromLocalStorage = () => {
  if (!isBrowser) return;
  localStorage.removeItem(customerAccessTokenKey);
};

export const getCustomerAccessTokenFromLocalStorage = ():
  | CustomerAccessToken
  | undefined => {
  if (!isBrowser) return undefined;
  const customerAccessTokenString = window.localStorage.getItem(
    customerAccessTokenKey,
  );
  let customerAccessToken: CustomerAccessToken | undefined;
  try {
    customerAccessToken = JSON.parse(customerAccessTokenString || '');
  } catch (error) {}
  return customerAccessToken;
};
