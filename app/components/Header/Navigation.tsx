import {memo} from 'react';
import {useCart} from '@shopify/hydrogen-react';

import {Link, Svg} from '~/components';
import {useCustomer, useMenu, useSettings} from '~/hooks';

import type {UseDesktopMenuReturn} from './useDesktopMenu';
import type {UseMobileMenuReturn} from './useMobileMenu';

type NavigationProps = Pick<
  UseMobileMenuReturn,
  'handleCloseMobileMenu' | 'handleOpenMobileMenu' | 'mobileMenuOpen'
> &
  Pick<
    UseDesktopMenuReturn,
    | 'handleDesktopMenuClose'
    | 'handleDesktopMenuHoverIn'
    | 'handleDesktopMenuHoverOut'
    | 'desktopMenuContent'
  >;

export const Navigation = memo(
  ({
    handleCloseMobileMenu,
    handleOpenMobileMenu,
    handleDesktopMenuClose,
    handleDesktopMenuHoverIn,
    handleDesktopMenuHoverOut,
    desktopMenuContent,
    mobileMenuOpen,
  }: NavigationProps) => {
    const {totalQuantity = 0} = useCart();
    const customer = useCustomer();
    const {openCart, openSearch} = useMenu();
    const {header} = useSettings();
    const {logoPositionDesktop, navItems} = {...header?.menu};
    const gridColsClassDesktop =
      logoPositionDesktop === 'center'
        ? 'lg:grid-cols-[1fr_auto_1fr]'
        : 'lg:grid-cols-[auto_1fr_auto]';
    const logoOrderClassDesktop =
      logoPositionDesktop === 'center' ? 'lg:order-2' : 'lg:order-1';
    const menuOrderClassDesktop =
      logoPositionDesktop === 'center' ? 'lg:order-1' : 'lg:order-2';

    return (
      <div
        className={`px-contained relative z-[1] grid flex-1 grid-cols-[1fr_auto_1fr] gap-4 border-b border-b-border bg-background transition md:gap-8 ${gridColsClassDesktop}`}
      >
        <div className={`order-2 flex items-center ${logoOrderClassDesktop}`}>
          <Link aria-label="Go to homepage" to="/">
            <Svg
              className="h-8 text-text"
              src="/svgs/pack-logo.svg#pack-logo"
              title="Storefront logo"
              viewBox="0 0 44 34"
            />
          </Link>
        </div>

        <div className={`order-1 flex items-center ${menuOrderClassDesktop}`}>
          <nav className="hidden h-full lg:flex">
            <ul className="flex">
              {navItems?.map((item, index) => {
                const isHovered =
                  item.navItem?.text === desktopMenuContent?.navItem?.text;

                return (
                  <li key={index} className="flex">
                    <Link
                      aria-label={item.navItem?.text}
                      className={`group relative flex cursor-pointer items-center px-4 transition ${
                        isHovered ? 'bg-neutralLightest' : 'bg-background'
                      }`}
                      to={item.navItem?.url}
                      onClick={handleDesktopMenuClose}
                      onMouseEnter={() => handleDesktopMenuHoverIn(index)}
                      onMouseLeave={handleDesktopMenuHoverOut}
                    >
                      <p className="text-nav">{item.navItem?.text}</p>

                      <div
                        className={`absolute left-0 top-[calc(100%_-_2px)] h-[3px] w-full origin-center scale-0 border-t-2 border-t-primary bg-transparent transition after:w-full group-hover:scale-100 ${
                          isHovered ? 'scale-100' : 'scale-0'
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <button
              aria-label={
                mobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'
              }
              className="w-5 lg:hidden"
              onClick={() => {
                if (mobileMenuOpen) handleCloseMobileMenu();
                else handleOpenMobileMenu();
              }}
              type="button"
            >
              {mobileMenuOpen ? (
                <Svg
                  className="w-full text-text"
                  src="/svgs/close.svg#close"
                  title="Close"
                  viewBox="0 0 24 24"
                />
              ) : (
                <Svg
                  className="w-full text-text"
                  src="/svgs/menu.svg#menu"
                  title="Navigation"
                  viewBox="0 0 24 24"
                />
              )}
            </button>

            <button
              aria-label="Open search"
              className="block w-5 md:hidden"
              onClick={openSearch}
              type="button"
            >
              <Svg
                className="w-full text-text"
                src="/svgs/search.svg#search"
                title="Search"
                viewBox="0 0 24 24"
              />
            </button>
          </div>
        </div>

        <div className="order-3 flex items-center justify-end gap-4 md:gap-5">
          <button
            aria-label="Open search"
            className="hidden w-5 md:block"
            onClick={openSearch}
            type="button"
          >
            <Svg
              className="w-full text-text"
              src="/svgs/search.svg#search"
              title="Search"
              viewBox="0 0 24 24"
            />
          </button>

          <Link
            aria-label="Go to account page"
            to={customer ? `/account/orders` : `/account/login`}
          >
            <Svg
              className="w-5 text-text"
              src="/svgs/account.svg#account"
              title="Account"
              viewBox="0 0 24 24"
            />
          </Link>

          <div className="relative flex items-center">
            <button
              aria-label="Open cart"
              className="w-5"
              onClick={openCart}
              type="button"
            >
              <Svg
                className="w-full text-text"
                src="/svgs/cart.svg#cart"
                title="Cart"
                viewBox="0 0 24 24"
              />
            </button>

            <p className="text-label-sm w-4 whitespace-nowrap pl-px font-bold">
              ({totalQuantity || 0})
            </p>
          </div>
        </div>
      </div>
    );
  },
);

Navigation.displayName = 'Navigation';
