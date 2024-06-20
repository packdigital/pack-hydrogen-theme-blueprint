import {Outlet} from '@remix-run/react';
import {json, redirect} from '@shopify/remix-oxygen';
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@shopify/remix-oxygen';

import {customerGetAction, customerGetClient} from '~/lib/customer';
import {pathWithoutLocalePrefix} from '~/lib/utils';
import {LOGGED_OUT_REDIRECT_TO, LOGGED_IN_REDIRECT_TO} from '~/lib/constants';

export async function action({context, request}: ActionFunctionArgs) {
  try {
    let body;
    try {
      body = await request.formData();
    } catch (error) {}
    const customerAccessTokenString = String(
      body?.get('customerAccessToken') || '',
    );
    const customerAccessToken = JSON.parse(customerAccessTokenString);

    const {errors, response} = await customerGetClient(context, {
      customerAccessToken,
    });

    if (errors?.length) {
      console.error('/account:action:error', errors);
      return json({customer: null, errors}, {status: 400});
    }

    return json({
      customer: response?.customer || null,
    });
  } catch (error) {
    console.error('/account:action:error', error);
    return json({customer: null, errors: [error]}, {status: 500});
  }
}

export async function loader({request, context, params}: LoaderFunctionArgs) {
  const {session} = context;
  const {locale} = params;
  const url = new URL(request.url);
  const pathname = pathWithoutLocalePrefix(url.pathname, `/${locale}`);
  const isAccountHome = pathname === '/account' || pathname === '/account/';

  const customerAccessToken = await session.get('customerAccessToken');
  const isLoggedIn = !!customerAccessToken?.accessToken;

  if (isAccountHome) {
    if (isLoggedIn) {
      return redirect(
        locale ? `/${locale}${LOGGED_IN_REDIRECT_TO}` : LOGGED_IN_REDIRECT_TO,
      );
    } else {
      return redirect(
        locale ? `/${locale}${LOGGED_OUT_REDIRECT_TO}` : LOGGED_OUT_REDIRECT_TO,
      );
    }
  }

  if (!isLoggedIn) {
    return json({
      isLoggedIn: false,
      customer: null,
      url: request.url,
    });
  }

  try {
    const {data} = await customerGetAction({context});
    if (!data?.customer) {
      throw new Error('Customer not found');
    }
    return json(
      {
        isLoggedIn: true,
        customer: data.customer,
        url: request.url,
      },
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      },
    );
  } catch (error) {
    console.error('There was a problem loading account', error);
    session.unset('customerAccessToken');
    return redirect(
      locale ? `/${locale}${LOGGED_OUT_REDIRECT_TO}` : LOGGED_OUT_REDIRECT_TO,
      {
        headers: {
          'Set-Cookie': await session.commit(),
        },
      },
    );
  }
}

export default function AccountsRoute() {
  return <Outlet />;
}
