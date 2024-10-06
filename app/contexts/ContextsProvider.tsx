import type {ReactNode} from 'react';

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
            <GroupingsProvider>{children}</GroupingsProvider>
          </PromobarProvider>
        </MenuProvider>
      </GlobalProvider>
    </SettingsProvider>
  );
}
