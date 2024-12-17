import clsx from 'clsx';
import type {ReactNode} from 'react';
import {useCallback, useEffect, useState, useRef} from 'react';
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

  const [hasUserConsent, setHasUserConsent] = useState<boolean>(false);
  const {publish} = useAnalytics();

  const publishRef = useRef(publish);

  useEffect(() => {
    publishRef.current = publish;
  }, [publish]);

  const handleTestExpose = (test: any) => {
    if (hasUserConsent) {
      setTimeout(() => {
        publishRef?.current?.(AnalyticsEvent.EXPERIMENT_EXPOSED, {test});
      }, 1000);
    }
  };

  // https://shopify.dev/docs/api/customer-privacy#use-an-event-listener
  useEffect(() => {
    const handleConsentChange = (event: any) => {
      const hasAnalyticsAllowed = event?.detail?.analyticsAllowed || false;

      setHasUserConsent(hasAnalyticsAllowed);
      console.log('Consent collected:', event.detail); // Log the event details if needed

      if (hasAnalyticsAllowed) {
        publish?.(AnalyticsEvent.EXPERIMENT_EXPOSED, {test: {adf: 124}});
      }
    };

    // Add event listener for 'visitorConsentCollected'
    document.addEventListener('visitorConsentCollected', handleConsentChange);

    return () => {
      // Clean up the event listener on unmount
      document.removeEventListener(
        'visitorConsentCollected',
        handleConsentChange,
      );
    };
  }, []);

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
