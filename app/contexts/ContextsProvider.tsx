import type {ReactNode} from 'react';

import {AnalyticsProvider} from './AnalyticsProvider';
import {GlobalProvider} from './GlobalProvider';
import {GroupingsProvider} from './GroupingsProvider';
import {MenuProvider} from './MenuProvider';
import {PromobarProvider} from './PromobarProvider';
import {SettingsProvider} from './SettingsProvider';

export function ContextsProvider({children}: {children: ReactNode}) {
  return (
    <SettingsProvider>
      <GlobalProvider>
        <MenuProvider>
          <PromobarProvider>
            <GroupingsProvider>
              <AnalyticsProvider>{children}</AnalyticsProvider>
            </GroupingsProvider>
          </PromobarProvider>
        </MenuProvider>
      </GlobalProvider>
    </SettingsProvider>
  );
}
