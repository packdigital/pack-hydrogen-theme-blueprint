import clsx from 'clsx';
import type {ReactNode} from 'react';
import {useCallback} from 'react';

import {useAnalytics} from '@shopify/hydrogen';
import {PackTestProvider} from '@pack/hydrogen';

import {Analytics} from '~/components/Analytics';
import {Cart} from '~/components/Cart';
import {Footer} from '~/components/Footer';
import {Header} from '~/components/Header';
import {Modal} from '~/components/Modal';
import {ProductModal} from '~/components/Product/ProductModal';
import {Search} from '~/components/Search';
import {AnalyticsEvent} from '~/components/Analytics/constants';
import {
  useCartAddDiscountUrl,
  usePromobar,
  useScrollToHashOnNavigation,
  useSetViewportHeightCssVar,
} from '~/hooks';

export function Layout({children}: {children: ReactNode}) {
  const {mainPaddingTopClass} = usePromobar();
  useCartAddDiscountUrl();
  useScrollToHashOnNavigation();
  useSetViewportHeightCssVar();

  return (
    <>
      <Analytics />

      <TestLayoutComponent>
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
      </TestLayoutComponent>
    </>
  );
}

const TestLayoutComponent = ({children}: {children: ReactNode}) => {
  const {publish} = useAnalytics();

  const handleTestExpose = useCallback(
    (test: any) => {
      console.log('==== I HAVE BEEN EXPOSED!!!', test);
      publish(AnalyticsEvent.EXPERIMENT_EXPOSED, {test});
    },
    [publish],
  );

  return (
    <PackTestProvider testExposureCallback={handleTestExpose}>
      {children}
    </PackTestProvider>
  );
};

Layout.displayName = 'Layout';
