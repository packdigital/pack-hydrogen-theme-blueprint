import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {CustomerAccessToken} from '@shopify/hydrogen/storefront-api-types';

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
