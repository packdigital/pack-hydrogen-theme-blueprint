import {useEffect} from 'react';
import {Outlet, useLoaderData} from '@remix-run/react';
import {data as dataWithOptions, redirect} from '@shopify/remix-oxygen';
import cookieParser from 'cookie';
import {useAnalytics} from '@shopify/hydrogen';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {Customer} from '@shopify/hydrogen/customer-account-api-types';

import {AnalyticsEvent} from '~/components/Analytics/constants';
import {CACHE_NONE} from '~/data/cache';
import {deleteCookie, pathWithoutLocalePrefix} from '~/lib/utils';
import {
  FROM_ACCOUNT_AUTHORIZATION_KEY,
  LOGGED_IN_COOKIE,
  LOGGED_IN_REDIRECT_TO,
  LOGGED_OUT_REDIRECT_TO,
  LOGGED_IN_PROFILE_REDIRECT_TO,
  REGISTERED_COOKIE,
} from '~/lib/constants';
import {CUSTOMER_DETAILS_QUERY} from '~/data/graphql/customer-account/customer';

export async function loader({context, request, params}: LoaderFunctionArgs) {
  const {locale} = params;
  const isLoggedIn = await context.customerAccount.isLoggedIn();

  if (!isLoggedIn) {
    return redirect(
      locale ? `/${locale}${LOGGED_OUT_REDIRECT_TO}` : LOGGED_OUT_REDIRECT_TO,
    );
  }
  const {data, errors} = await context.customerAccount.query(
    CUSTOMER_DETAILS_QUERY,
  );
  // If the customer failed to load, we assume their access token is invalid.
  if (errors?.length || !data?.customer) {
    throw await context.customerAccount.logout();
  }

  const url = new URL(request.url);
  const pathname = pathWithoutLocalePrefix(url.pathname, `/${locale}`);
  const isAccountHome = pathname === '/account' || pathname === '/account/';

  if (isAccountHome) {
    const searchParams = new URL(request.url).searchParams;
    // Check if from authorization redirect
    const isFromAuthorization =
      searchParams.get(FROM_ACCOUNT_AUTHORIZATION_KEY) === '1';
    let cookieName: string = LOGGED_IN_COOKIE;
    if (isFromAuthorization) {
      // Determine if from registration based on if creation date was within last 5 seconds
      const isFromRegistration =
        Date.now() - new Date(data.customer.creationDate).getTime() < 5000;
      if (isFromRegistration) cookieName = REGISTERED_COOKIE;
    }
    // If customer signs up with incomplete profile, redirect to profile page
    const redirectTo =
      !data.customer.firstName || !data.customer.lastName
        ? LOGGED_IN_PROFILE_REDIRECT_TO
        : LOGGED_IN_REDIRECT_TO;

    const cookieExpiresAtInMs = Date.now() + 5000; // 5 seconds
    const cookieExpiresAt = new Date(cookieExpiresAtInMs).toUTCString();

    return redirect(
      locale ? `/${locale}${redirectTo}` : redirectTo,
      isFromAuthorization
        ? {
            headers: {
              'Set-Cookie': `${cookieName}=${Date.now()}; Expires=${cookieExpiresAt};`,
            },
          }
        : undefined,
    );
  }

  return dataWithOptions(
    {customer: data.customer as Customer},
    {headers: {'Cache-Control': CACHE_NONE}},
  );
}

export default function AccountsRoute() {
  const {customer} = useLoaderData<{customer: Customer}>();
  const {publish} = useAnalytics();

  // On mount, check for any login or registration cookie and fire analytics event
  useEffect(() => {
    if (!customer) return;
    const cookies = cookieParser.parse(document.cookie);
    const registeredCookie = cookies[REGISTERED_COOKIE];
    const loggedInCookie = cookies[LOGGED_IN_COOKIE];
    if (registeredCookie) {
      publish(AnalyticsEvent.CUSTOMER_REGISTERED, {customer});
      deleteCookie(REGISTERED_COOKIE);
    } else if (loggedInCookie) {
      publish(AnalyticsEvent.CUSTOMER_LOGGED_IN, {customer});
      deleteCookie(LOGGED_IN_COOKIE);
    }
  }, [customer, publish]);

  return <Outlet />;
}
