import {useCallback, useEffect, useRef, useState} from 'react';
import {useCart} from '@shopify/hydrogen-react';
import {useLocation} from '@remix-run/react';
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

const isElevar =
  typeof document !== 'undefined' && !!window.ENV?.PUBLIC_ELEVAR_SIGNING_KEY;

export function useDataLayerCustomer({
  cartReady,
  currencyCode,
  handleDataLayerEvent,
  userProperties,
}: {
  cartReady: boolean;
  currencyCode?: CurrencyCode | undefined;
  handleDataLayerEvent: (event: Record<string, any>) => void;
  userProperties: UserProperties;
}) {
  const pathnameRef = useRef<string | undefined>(undefined);
  const {cost, lines = []} = useCart();
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
        event: 'dl_user_data',
        ...(isElevar ? {cart_total: cost?.totalAmount?.amount || '0.0'} : null),
        user_properties: _userProperties,
        ecommerce: {
          currencyCode:
            passedCurrencyCode ||
            cost?.totalAmount?.currencyCode ||
            currencyCode,
          cart_contents: {
            products: lines?.map(mapCartLine(list)) || [],
          },
          ...(isElevar
            ? null
            : {cart_total: cost?.totalAmount?.amount || '0.0'}),
        },
      };
      handleDataLayerEvent(event);
      setUserDataEventTriggered(true);
    },
    [cartReady, currencyCode],
  );

  // Trigger 'user_data' event on path change after base data is ready,
  // excluding account and paths that trigger event directly before their respective events
  useEffect(() => {
    if (
      !userProperties ||
      !cartReady ||
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
  }, [cartReady, pathname, !!userProperties]);

  // Trigger 'user_data' event on account pages after base data is ready,
  // excluding after login/register events
  useEffect(() => {
    if (
      !userProperties ||
      !cartReady ||
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
  }, [cartReady, pathname, !!userProperties]);

  return {userDataEvent, userDataEventTriggered};
}
