import {useMemo} from 'react';
import {Analytics} from '@shopify/hydrogen';
import {useCart} from '@shopify/hydrogen-react';
import type {ReactNode} from 'react';
import type {CartReturn, ShopAnalytics} from '@shopify/hydrogen';

import {useGlobal, useRootLoaderData} from '~/hooks';

export function AnalyticsProvider({children}: {children: ReactNode}) {
  const {consent, cookieDomain, shop} = useRootLoaderData();
  const cart = useCart();
  const {isCartReady, isBot} = useGlobal();

  const cartForAnalytics = useMemo(() => {
    return {
      id: 'uninitialized',
      updatedAt: 'uninitialized',
      ...cart,
      lines: {nodes: cart.lines},
    } as CartReturn;
  }, [cart]);

  return (
    <Analytics.Provider
      shop={(isBot ? null : shop) as Promise<ShopAnalytics | null>}
      cart={isCartReady ? cartForAnalytics : null}
      consent={consent}
      cookieDomain={cookieDomain}
    >
      {children}
    </Analytics.Provider>
  );
}

AnalyticsProvider.displayName = 'AnalyticsProvider';
