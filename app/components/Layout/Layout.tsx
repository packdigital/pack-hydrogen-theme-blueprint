import type {ReactNode} from 'react';

import {Cart, Footer, Header, Modal, Search} from '~/components';
import {useSetViewportHeightCssVar, useSettings} from '~/hooks';

export function Layout({children}: {children: ReactNode}) {
  const {header} = useSettings();
  useSetViewportHeightCssVar();

  const {promobar} = {...header};
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

      <main role="main" id="mainContent" className={`grow ${paddingTop}`}>
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
