import {useCallback, useEffect, useRef, useState} from 'react';
import {useCart} from '@shopify/hydrogen-react';
import {useLocation} from '@remix-run/react';
import {v4 as uuidv4} from 'uuid';
import type {CurrencyCode} from '@shopify/hydrogen-react/storefront-api-types';

import {pathWithoutLocalePrefix} from '~/lib/utils';

import {mapCartLine} from './utils';
import type {UserProperties} from './useDataLayerInit';

const IGNORED_PATHS = ['account', 'cart', 'collections', 'products', 'search'];
const LOGGED_OUT_ACCOUNT_PATHS = [
  '/account/login',
  '/account/register',
  '/account/reset',
  '/account/activate',
];

export function useDataLayerCustomer({
  currencyCode,
  DEBUG,
  userProperties,
}: {
  currencyCode?: CurrencyCode | undefined;
  DEBUG?: boolean;
  userProperties: UserProperties;
}) {
  const pathnameRef = useRef<string | undefined>(undefined);
  const {cost, lines = [], status} = useCart();
  const location = useLocation();
  const pathname = pathWithoutLocalePrefix(location.pathname);

  const [userDataEventTriggered, setUserDataEventTriggered] = useState(false);

  const userDataEvent = useCallback(
    ({
      currencyCode: passedCurrencyCode,
      userProperties: _userProperties,
    }: {
      currencyCode?: CurrencyCode | undefined;
      userProperties: UserProperties;
    }) => {
      const previousPath = sessionStorage.getItem('PREVIOUS_PATH');
      const windowPathname = pathWithoutLocalePrefix(window.location.pathname);
      const list =
        (windowPathname.startsWith('/collections') && windowPathname) ||
        (previousPath?.startsWith('/collections') && previousPath) ||
        '';
      const event = {
        event: 'user_data',
        event_id: uuidv4(),
        event_time: new Date().toISOString(),
        cart_total: cost?.totalAmount?.amount || '0.0',
        user_properties: _userProperties,
        ecommerce: {
          currencyCode:
            passedCurrencyCode ||
            cost?.totalAmount?.currencyCode ||
            currencyCode,
          cart_contents: {
            products: lines?.map(mapCartLine(list)) || [],
          },
        },
      };

      if (window.gtag) window.gtag('event', event.event, event);
      if (DEBUG) console.log(`DataLayer:gtag:${event.event}`, event);
      setUserDataEventTriggered(true);
    },
    [status === 'idle', currencyCode],
  );

  // Trigger 'user_data' event on path change after base data is ready,
  // excluding account and paths that trigger event directly before their respective events
  useEffect(() => {
    if (
      !userProperties ||
      IGNORED_PATHS.includes(pathname.split('/')[1]) ||
      pathname.startsWith('/pages/search') ||
      pathname === pathnameRef.current
    )
      return undefined;

    userDataEvent({userProperties});

    pathnameRef.current = pathname;
    return () => {
      pathnameRef.current = undefined;
    };
  }, [pathname, !!userProperties]);

  // Trigger 'user_data' event on account pages after base data is ready,
  // excluding after login/register events
  useEffect(() => {
    if (
      !userProperties ||
      !pathname.startsWith('/account') ||
      pathname === pathnameRef.current
    )
      return undefined;

    const prevPath = sessionStorage.getItem('PREVIOUS_PATH') || '';
    const currentPath = sessionStorage.getItem('CURRENT_PATH') || '';
    const prevPathInlcRefresh =
      sessionStorage.getItem('PREVIOUS_PATH_INLC_REFRESH') || '';

    // On login or register, prevent event as it triggers directly from the login/register events
    const isFromLoginOrRegisterEvent =
      (prevPath.startsWith('/account/login') ||
        prevPath.startsWith('/account/register')) &&
      currentPath !== prevPathInlcRefresh;
    const isLoggedOutAccountPath = LOGGED_OUT_ACCOUNT_PATHS.some((path) =>
      pathname.startsWith(path),
    );
    if (isFromLoginOrRegisterEvent && !isLoggedOutAccountPath) return undefined;

    // On log out, trigger event with guest visitor type
    const isFromLogoutEvent =
      pathname.startsWith('/account/login') && prevPath.startsWith('/account');
    const prevPathIsLoggedOutAccountPath = LOGGED_OUT_ACCOUNT_PATHS.some(
      (path) => prevPath.startsWith(path),
    );
    if (isFromLogoutEvent && !prevPathIsLoggedOutAccountPath) {
      userDataEvent({
        userProperties: {visitor_type: 'guest', user_consent: ''},
      });
    } else {
      // Else trigger event for all other instances
      userDataEvent({userProperties});
    }

    pathnameRef.current = pathname;
    return () => {
      pathnameRef.current = undefined;
    };
  }, [pathname, !!userProperties]);

  return {userDataEvent, userDataEventTriggered};
}
