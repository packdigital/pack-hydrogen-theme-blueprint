import {useEffect, useMemo, useState} from 'react';
import {Analytics} from '@shopify/hydrogen';
import {useCart} from '@shopify/hydrogen-react';
import {load} from '@fingerprintjs/botd';
import type {ReactNode} from 'react';
import type {CartReturn, ShopAnalytics} from '@shopify/hydrogen';

import {useGlobal, useRootLoaderData} from '~/hooks';

const botdPromise = load();

export function AnalyticsProvider({children}: {children: ReactNode}) {
  const {consent, cookieDomain, shop} = useRootLoaderData();
  const cart = useCart();
  const {isCartReady} = useGlobal();

  const [isBot, setIsBot] = useState(false);

  const cartForAnalytics = useMemo(() => {
    return {
      id: 'uninitialized',
      updatedAt: 'uninitialized',
      ...cart,
      lines: {nodes: cart.lines},
    } as CartReturn;
  }, [cart]);

  useEffect(() => {
    botdPromise
      .then((botd) => botd.detect())
      .then((result) => setIsBot(result.bot));
  }, [botdPromise]);

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
