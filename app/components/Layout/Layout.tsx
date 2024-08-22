import {Analytics} from '@shopify/hydrogen';
import type {ReactNode} from 'react';

import {Cart, Footer, Header, Modal, PackAnalytics, Search} from '~/components';
import {usePreviewModeCustomerInit} from '~/lib/customer';
import {
  useCartAddDiscountUrl,
  useCartForAnalytics,
  usePromobar,
  useRootLoaderData,
  useSetViewportHeightCssVar,
} from '~/hooks';

export function Layout({children}: {children: ReactNode}) {
  const {consent, shop} = useRootLoaderData();
  const {mainPaddingTopClass} = usePromobar();
  const cartForAnalytics = useCartForAnalytics();
  useCartAddDiscountUrl();
  usePreviewModeCustomerInit();
  useSetViewportHeightCssVar();

  return (
    <Analytics.Provider shop={shop} cart={cartForAnalytics} consent={consent}>
      <>
        <PackAnalytics />

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
    </Analytics.Provider>
  );
}

Layout.displayName = 'Layout';
