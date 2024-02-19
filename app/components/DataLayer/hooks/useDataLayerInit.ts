import {useCallback, useEffect, useRef, useState} from 'react';
import {useLocation} from '@remix-run/react';
import {v4 as uuidv4} from 'uuid';
import type {Customer} from '@shopify/hydrogen/storefront-api-types';

import {pathWithoutLocalePrefix} from '~/lib/utils';
import {useCustomer} from '~/hooks';

interface LoggedInUserProperties {
  visitor_type: string;
  user_consent: string;
  customer_address_1: string;
  customer_address_2: string;
  customer_city: string;
  customer_country: string;
  customer_country_code: string;
  customer_email: string;
  customer_first_name: string;
  customer_id: string;
  customer_last_name: string;
  customer_order_count: string;
  customer_phone: string;
  customer_province_code: string;
  customer_province: string;
  customer_tags: string;
  customer_total_spent: string;
  customer_zip: string;
}

interface GuestUserProperties {
  visitor_type: string;
  user_consent: string;
}

export type UserProperties =
  | LoggedInUserProperties
  | GuestUserProperties
  | null;

const PAGE_TYPES: Record<string, string> = {
  '/': 'home',
  '/account': 'customersAccount',
  '/account/activate': 'customersActivateAccount',
  '/account/addresses': 'customersAddresses',
  '/account/login': 'customersLogin',
  '/account/orders/': 'customersOrders',
  '/account/register': 'customersRegister',
  '/account/reset': 'customersResetPassword',
  '/articles': 'article',
  '/blogs': 'blog',
  '/cart': 'cart',
  '/collections': 'collection',
  '/not-found': 'notFound',
  '/pages': 'page',
  '/404': 'notFound',
  '/pages/privacy-policy': 'policy',
  '/pages/search': 'search',
  '/products': 'product',
  '/search': 'search',
};

export function useDataLayerInit({DEBUG}: {DEBUG: boolean}) {
  const pathnameRef = useRef<string | undefined>(undefined);
  const location = useLocation();
  const pathname = pathWithoutLocalePrefix(location.pathname);

  const [userProperties, setUserProperties] = useState<UserProperties>(null);

  const customer = useCustomer();

  const generateUserProperties = useCallback(
    async ({customer: _customer}: {customer: Customer | null}) => {
      let _userProperties: UserProperties = null;
      if (_customer) {
        _userProperties = {
          visitor_type: 'logged_in',
          user_consent: '',
          customer_address_1: _customer.defaultAddress?.address1 || '',
          customer_address_2: _customer.defaultAddress?.address2 || '',
          customer_city: _customer.defaultAddress?.city || '',
          customer_country: _customer.defaultAddress?.country || '',
          customer_country_code: _customer.defaultAddress?.countryCode || '',
          customer_email: _customer.email || '',
          customer_first_name: _customer.firstName || '',
          customer_id: _customer.id?.split('/').pop() || '',
          customer_last_name: _customer.lastName || '',
          customer_order_count: `${_customer?.numberOfOrders || 0}`,
          customer_phone: _customer.defaultAddress?.phone || '',
          customer_province_code: _customer.defaultAddress?.provinceCode || '',
          customer_province: _customer.defaultAddress?.province || '',
          customer_tags: _customer.tags?.join(', ') || '',
          customer_total_spent: _customer.orders?.edges
            ?.reduce((acc: number, {node}) => {
              return acc + parseFloat(node.totalPrice?.amount || '0');
            }, 0)
            .toFixed(2),
          customer_zip: _customer.defaultAddress?.zip || '',
        };
      } else {
        _userProperties = {
          visitor_type: 'guest',
          user_consent: '',
        };
      }
      setUserProperties(_userProperties);
      return _userProperties;
    },
    [],
  );

  // Set user id on customer ready
  useEffect(() => {
    if (!customer || !window.ENV?.PUBLIC_GA4_TAG_ID) return;
    if (window.gtag) {
      window.gtag('config', `${window.ENV.PUBLIC_GA4_TAG_ID}`, {
        user_id: customer.id?.split('/').pop() || '',
      });
    }
  }, [customer?.id]);

  // Set page view event on path change
  useEffect(() => {
    const pageType = pathname.startsWith('/account/orders/')
      ? PAGE_TYPES['/account/orders/']
      : PAGE_TYPES[pathname] ||
        PAGE_TYPES[pathname.split('/').slice(0, -1).join('/')] ||
        '';
    const event = {
      event: 'route_update',
      event_id: uuidv4(),
      event_time: new Date().toISOString(),
      page: {
        pathname,
        title: document.title,
        type: pageType,
        search: window.location.search,
      },
    };

    if (window.gtag) window.gtag('event', event.event, event);
    if (DEBUG) console.log(`DataLayer:gtag:${event.event}`, event);
  }, [pathname]);

  // Set previous paths and current path in session storage
  useEffect(() => {
    const currentPath = sessionStorage.getItem('CURRENT_PATH') || '';
    if (pathname === currentPath) {
      sessionStorage.setItem('PREVIOUS_PATH_INLC_REFRESH', pathname);
      return;
    }
    sessionStorage.setItem('PREVIOUS_PATH', currentPath);
    sessionStorage.setItem('PREVIOUS_PATH_INLC_REFRESH', currentPath);
    sessionStorage.setItem('CURRENT_PATH', pathname);
  }, [pathname]);

  // Generate user properties on customer ready and path change
  useEffect(() => {
    if (pathname === pathnameRef.current) return undefined;
    generateUserProperties({customer});
    pathnameRef.current = pathname;
    return () => {
      pathnameRef.current = undefined;
    };
  }, [pathname, !!customer]);

  return {
    generateUserProperties,
    userProperties,
  };
}
