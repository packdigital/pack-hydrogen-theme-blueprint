import type {ReactNode} from 'react';

import {Analytics, Cart, Footer, Header, Modal, Search} from '~/components';
import {usePreviewModeCustomerInit} from '~/lib/customer';
import {
  useCartAddDiscountUrl,
  usePromobar,
  useScrollToHashOnNavigation,
  useSetViewportHeightCssVar,
} from '~/hooks';

export function Layout({children}: {children: ReactNode}) {
  const {mainPaddingTopClass} = usePromobar();
  useCartAddDiscountUrl();
  usePreviewModeCustomerInit();
  useScrollToHashOnNavigation();
  useSetViewportHeightCssVar();

  return (
    <>
      <Analytics />

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
    </>
  );
}

Layout.displayName = 'Layout';
