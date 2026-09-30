import {useEffect, useRef} from 'react';
import {useLocation} from 'react-router';
import clsx from 'clsx';
import type {ReactNode} from 'react';

import {Analytics} from '~/components/Analytics';
import {Cart} from '~/components/Cart';
import {Footer} from '~/components/Footer';
import {Header} from '~/components/Header';
import {Modal} from '~/components/Modal';
import {ProductModal} from '~/components/Product/ProductModal';
import {Search} from '~/components/Search';
import {
  useAnnounce,
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
  useRouteChangeFocus();

  return (
    <>
      <Analytics />

      <div
        className="flex h-[var(--viewport-height)] flex-col"
        data-comp={Layout.displayName}
      >
        <a className="skip-link" href="#mainContent">
          Skip to content
        </a>

        <Header />

        <main
          id="mainContent"
          className={clsx('grow', mainPaddingTopClass)}
          tabIndex={-1}
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

/**
 * On client-side navigation, move focus to <main> and announce the new page
 * title, so keyboard and screen reader users aren't left on a stale link
 * (WCAG 2.4.3, 4.1.3). Query-string changes (filters, sort) are ignored.
 * In-place navigations (e.g. picking a grouped product's color) opt out by
 * passing `state={{preserveFocus: true}}` to the link.
 */
function useRouteChangeFocus() {
  const {pathname, state} = useLocation();
  const announce = useAnnounce();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return undefined;
    }
    if ((state as {preserveFocus?: boolean} | null)?.preserveFocus) {
      return undefined;
    }
    // Wait for the new route's <title> to render
    const timeout = setTimeout(() => {
      document.getElementById('mainContent')?.focus({preventScroll: true});
      if (document.title) announce(document.title);
    }, 100);
    return () => clearTimeout(timeout);
  }, [pathname]);
}
