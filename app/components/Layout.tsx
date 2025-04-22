import clsx from 'clsx';
import type {ReactNode} from 'react';

import {Analytics} from '~/components/Analytics';
import {Cart} from '~/components/Cart';
import {Footer} from '~/components/Footer';
import {Header} from '~/components/Header';
import {Modal} from '~/components/Modal';
import {ProductModal} from '~/components/Product/ProductModal';
import {Search} from '~/components/Search';
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
          className={clsx('grow', mainPaddingTopClass)}
        >
          {children}
        </main>

        <Footer />

        <ProductModal />

        <Cart />

        <Search />

        <Modal />
      </div>
    </>
  );
}

Layout.displayName = 'Layout';
