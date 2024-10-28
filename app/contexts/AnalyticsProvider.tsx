import {useMemo} from 'react';
import {Analytics} from '@shopify/hydrogen';
import {useCart} from '@shopify/hydrogen-react';
import type {ReactNode} from 'react';
import type {CartReturn} from '@shopify/hydrogen';

import {useGlobal, useRootLoaderData} from '~/hooks';

export function AnalyticsProvider({children}: {children: ReactNode}) {
  const {consent, cookieDomain, shop} = useRootLoaderData();
  const cart = useCart();
  const {isCartReady} = useGlobal();

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
      shop={shop}
      cart={isCartReady ? cartForAnalytics : null}
      consent={consent}
      cookieDomain={cookieDomain}
    >
      {children}
    </Analytics.Provider>
  );
}

AnalyticsProvider.displayName = 'AnalyticsProvider';
