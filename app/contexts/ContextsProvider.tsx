import type {ReactNode} from 'react';

import {B2BLocationProvider} from '~/components/B2B';

import {AnalyticsProvider} from './AnalyticsProvider';
import {GlobalProvider} from './GlobalProvider/GlobalProvider';
import {GroupingsProvider} from './GroupingsProvider/GroupingsProvider';
import {MenuProvider} from './MenuProvider/MenuProvider';
import {PromobarProvider} from './PromobarProvider/PromobarProvider';
import {SettingsProvider} from './SettingsProvider/SettingsProvider';

export function ContextsProvider({children}: {children: ReactNode}) {
  return (
    <SettingsProvider>
      <GlobalProvider>
        <MenuProvider>
          <PromobarProvider>
            <GroupingsProvider>
              <B2BLocationProvider>
                <AnalyticsProvider>{children}</AnalyticsProvider>
              </B2BLocationProvider>
            </GroupingsProvider>
          </PromobarProvider>
        </MenuProvider>
      </GlobalProvider>
    </SettingsProvider>
  );
}
