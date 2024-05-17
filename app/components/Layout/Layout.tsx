import type {ReactNode} from 'react';

import {Cart, Footer, Header, Modal, Search} from '~/components';
import {
  useCartAddDiscountUrl,
  usePromobar,
  useSetViewportHeightCssVar,
} from '~/hooks';

export function Layout({children}: {children: ReactNode}) {
  const {mainPaddingTopClass} = usePromobar();
  useSetViewportHeightCssVar();
  useCartAddDiscountUrl();

  return (
    <div
      className="flex h-[var(--viewport-height)] flex-col"
      data-comp={Layout.displayName}
    >
      <Header />

      <main
        role="main"
        id="mainContent"
        className={`grow ${mainPaddingTopClass}`}
      >
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
