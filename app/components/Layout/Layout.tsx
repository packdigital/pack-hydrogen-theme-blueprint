import type {ReactNode} from 'react';
import {useSiteSettings} from '@pack/react';

import {Cart, Footer, Header, Modal, Search} from '~/components';
import type {SiteSettings} from '~/lib/types';
import {useSetViewportHeightCssVar} from '~/hooks';

export function Layout({children}: {children: ReactNode}) {
  const siteSettings = useSiteSettings() as SiteSettings;
  useSetViewportHeightCssVar();

  const {promobar} = {...siteSettings?.settings?.header};
  const promobarDisabled =
    !!promobar && (!promobar.enabled || !promobar.messages?.length);
  const paddingTop = promobarDisabled
    ? 'pt-[var(--header-height)]'
    : 'pt-[calc(var(--header-height)+var(--promobar-height))]';

  return (
    <div
      className="flex h-[var(--viewport-height)] flex-col"
      data-comp={Layout.displayName}
    >
      <Header />

      <main role="main" id="mainContent" className={`flex-grow ${paddingTop}`}>
        {children}
      </main>

      <Footer />

      <Cart />

      <Search />

      <Modal />
    </div>
  );
}

Layout.displayName = 'Layout';
