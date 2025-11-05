import {Analytics} from '@shopify/hydrogen';
import type {ReactNode} from 'react';
import type {ShopAnalytics} from '@shopify/hydrogen';
import type {Cart} from '@shopify/hydrogen/storefront-api-types';

import {useGlobal, useRootLoaderData} from '~/hooks';

export function AnalyticsProvider({children}: {children: ReactNode}) {
  const {cart, consent, cookieDomain, shop} = useRootLoaderData();
  const {isBot} = useGlobal();

  return (
    <Analytics.Provider
      shop={(isBot ? null : shop) as Promise<ShopAnalytics | null>}
      cart={cart as Promise<Cart>}
      consent={consent}
      cookieDomain={cookieDomain}
    >
      {children}
    </Analytics.Provider>
  );
}

AnalyticsProvider.displayName = 'AnalyticsProvider';
