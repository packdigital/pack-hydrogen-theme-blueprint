import type {ReactNode} from 'react';

import {PlaybookCartBridge} from '~/components/Document/PlaybookCartBridge';

import {AnalyticsProvider} from './AnalyticsProvider';
import {CartProvider} from './CartProvider/CartProvider';
import {GlobalProvider} from './GlobalProvider/GlobalProvider';
import {GroupingsProvider} from './GroupingsProvider/GroupingsProvider';
import {MenuProvider} from './MenuProvider/MenuProvider';
import {ShopifyProvider} from './ShopifyProvider';
import {PromobarProvider} from './PromobarProvider/PromobarProvider';
import {SettingsProvider} from './SettingsProvider/SettingsProvider';

export function ContextsProvider({children}: {children: ReactNode}) {
  return (
    <ShopifyProvider>
      <CartProvider>
        <SettingsProvider>
          <GlobalProvider>
            <MenuProvider>
              <PromobarProvider>
                <GroupingsProvider>
                  <AnalyticsProvider>
                    {/* Innermost on purpose: the bridge needs the CART for the
                        write and the MENU to open the drawer afterwards, so it
                        has to sit inside both providers. */}
                    <PlaybookCartBridge />
                    {children}
                  </AnalyticsProvider>
                </GroupingsProvider>
              </PromobarProvider>
            </MenuProvider>
          </GlobalProvider>
        </SettingsProvider>
      </CartProvider>
    </ShopifyProvider>
  );
}
