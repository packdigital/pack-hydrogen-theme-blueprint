import clsx from 'clsx';
import type {ReactNode} from 'react';
import {PackTestProvider} from '@pack/hydrogen';

import {Analytics} from '~/components/Analytics';
import {Cart} from '~/components/Cart';
import {Footer} from '~/components/Footer';
import {Header} from '~/components/Header';
import {Modal} from '~/components/Modal';
import {ProductModal} from '~/components/Product/ProductModal';
import {Search} from '~/components/Search';
import {
  useCartAddDiscountUrl,
  usePromobar,
  useScrollToHashOnNavigation,
  useSetViewportHeightCssVar,
  useTestExpose,
} from '~/hooks';
export function Layout({children}: {children: ReactNode}) {
  const {mainPaddingTopClass} = usePromobar();
  useCartAddDiscountUrl();
  useScrollToHashOnNavigation();
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
      </PackTestProvider>
    </>
  );
}

Layout.displayName = 'Layout';
