import type {ReactNode} from 'react';
import {useCallback} from 'react';

import {useAnalytics} from '@shopify/hydrogen';
import {PackTestProvider} from '@pack/hydrogen';

import {Analytics, Cart, Footer, Header, Modal, Search} from '~/components';
import {AnalyticsEvent} from '~/components/Analytics/constants';
import {usePreviewModeCustomerInit} from '~/lib/customer';
import {
  useCartAddDiscountUrl,
  usePromobar,
  useSetViewportHeightCssVar,
} from '~/hooks';

export function Layout({children}: {children: ReactNode}) {
  const {mainPaddingTopClass} = usePromobar();
  useCartAddDiscountUrl();
  usePreviewModeCustomerInit();
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
            className={`grow ${mainPaddingTopClass}`}
          >
            {children}
          </main>

          <Footer />

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
