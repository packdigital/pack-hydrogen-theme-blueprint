import {useMemo} from 'react';
import {Analytics} from '@shopify/hydrogen';
import type {ReactNode} from 'react';
import type {CartReturn, ShopAnalytics} from '@shopify/hydrogen';

import {useCart, useGlobal, useRootLoaderData} from '~/hooks';

export function AnalyticsProvider({children}: {children: ReactNode}) {
  const {consent, cookieDomain, shop} = useRootLoaderData();
  const cart = useCart();
  const {isCartReady, isBot} = useGlobal();

  const cartForAnalytics = useMemo(() => {
    // SSR cart already has lines as a flat array; wrap for Analytics.Provider
    return {
      ...cart,
      id: cart?.id || 'uninitialized',
      updatedAt: cart?.updatedAt || 'uninitialized',
      lines: {nodes: Array.isArray(cart.lines) ? cart.lines : []},
    } as unknown as CartReturn;
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
