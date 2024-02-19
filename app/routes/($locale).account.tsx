import {Outlet, useLoaderData} from '@remix-run/react';
import {json, redirect} from '@shopify/remix-oxygen';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {CustomerAccountLayout, GuestAccountLayout} from '~/components';
import {customerGetAction} from '~/lib/customer';
import {pathWithoutLocalePrefix} from '~/lib/utils';

export async function loader({request, context, params}: LoaderFunctionArgs) {
  const {session} = context;
  const {locale} = params;
  const url = new URL(request.url);
  const pathname = pathWithoutLocalePrefix(url.pathname, `/${locale}`);
  const customerAccessToken = await session.get('customerAccessToken');
  const isLoggedIn = !!customerAccessToken?.accessToken;
  const isAccountHome = pathname === '/account' || pathname === '/account/';
  // Any new private account routes need to be added to this regex
  const isPrivateRoute =
    /^(\/[a-zA-Z]{2}-[a-zA-Z]{2})?\/account\/(orders|orders\/.*|profile|addresses|addresses\/.*)$/.test(
      pathname,
    );

  if (!isLoggedIn) {
    if (isPrivateRoute || isAccountHome) {
      session.unset('customerAccessToken');
      return redirect(locale ? `/${locale}/account/login` : '/account/login', {
        headers: {
          'Set-Cookie': await session.commit(),
        },
      });
    } else {
      return json({
        isLoggedIn: false,
        isAccountHome,
        isPrivateRoute,
        customer: null,
      });
    }
  } else {
    if (isAccountHome) {
      return redirect(locale ? `/${locale}/account/orders` : '/account/orders');
    }
  }

  try {
    const {data} = await customerGetAction({context});
    if (!data?.customer) {
      throw new Error('Customer not found');
    }
    return json(
      {isLoggedIn, isPrivateRoute, isAccountHome, customer: data.customer},
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      },
    );
  } catch (error) {
    console.error('There was a problem loading account', error);
    session.unset('customerAccessToken');
    return redirect(locale ? `/${locale}/account/login` : '/account/login', {
      headers: {
        'Set-Cookie': await session.commit(),
      },
    });
  }
}

export default function AccountsRoute() {
  const {isPrivateRoute, isAccountHome} = useLoaderData<typeof loader>();

  if (!isPrivateRoute && !isAccountHome) {
    return (
      <GuestAccountLayout>
        <Outlet />
      </GuestAccountLayout>
    );
  }

  return (
    <CustomerAccountLayout>
      <Outlet />
    </CustomerAccountLayout>
  );
}
