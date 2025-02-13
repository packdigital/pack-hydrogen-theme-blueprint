import type {ReactNode} from 'react';
import {PackTestProvider} from '@pack/hydrogen';

import {Analytics, Cart, Footer, Header, Modal, Search} from '~/components';
import {usePreviewModeCustomerInit} from '~/lib/customer';
import {
  useCartAddDiscountUrl,
  usePromobar,
  useSetViewportHeightCssVar,
  useTestExpose,
} from '~/hooks';
export function Layout({children}: {children: ReactNode}) {
  const {mainPaddingTopClass} = usePromobar();
  useCartAddDiscountUrl();
  usePreviewModeCustomerInit();
  useSetViewportHeightCssVar();

  const {handleTestExpose, hasUserConsent} = useTestExpose();

  return (
    <>
      <Analytics />
      <PackTestProvider
        hasUserConsent={hasUserConsent}
        testExposureCallback={handleTestExpose}
      >
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
      </PackTestProvider>
    </>
  );
}

Layout.displayName = 'Layout';
