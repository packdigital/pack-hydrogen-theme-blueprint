import {memo} from 'react';
import clsx from 'clsx';

import {Link} from '~/components/Link';
import {Svg} from '~/components/Svg';
import {HEADER_NAVIGATION} from '~/lib/constants';
import {useCustomer, useMenu, useSettings} from '~/hooks';

import type {UseDesktopMenuReturn} from '../useDesktopMenu';
import type {UseMobileMenuReturn} from '../useMobileMenu';

import {NavigationCart} from './NavigationCart';
import {NavigationLogo} from './NavigationLogo';

type NavigationProps = Pick<
  UseMobileMenuReturn,
  'handleCloseMobileMenu' | 'handleOpenMobileMenu' | 'mobileMenuOpen'
> &
  Pick<
    UseDesktopMenuReturn,
    | 'desktopMenuIndex'
    | 'handleDesktopMenuClose'
    | 'handleDesktopMenuHoverIn'
    | 'handleDesktopMenuHoverOut'
  >;

export const Navigation = memo(
  ({
    desktopMenuIndex,
    handleCloseMobileMenu,
    handleDesktopMenuClose,
    handleDesktopMenuHoverIn,
    handleDesktopMenuHoverOut,
    handleOpenMobileMenu,
    mobileMenuOpen,
  }: NavigationProps) => {
    const customer = useCustomer();
    const {closeAll, openSearch} = useMenu();
    const {header} = useSettings();
    const {
      bgColor = 'var(--background)',
      textColor = 'var(--text)',
      iconColor = 'var(--text)',
      logoPositionDesktop,
      navItems,
    } = {
      ...header?.menu,
    };
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
        className={clsx(
          'px-contained relative z-[1] grid flex-1 grid-cols-[1fr_auto_1fr] gap-4 border-b border-b-border transition md:gap-8',
          gridColsClassDesktop,
        )}
        data-comp={HEADER_NAVIGATION}
        style={{backgroundColor: bgColor, color: textColor}}
      >
        <div
          className={clsx('order-2 flex items-center', logoOrderClassDesktop)}
        >
          <NavigationLogo color={iconColor} />
        </div>

        <div
          className={clsx('order-1 flex items-center', menuOrderClassDesktop)}
        >
          <nav className="hidden h-full lg:flex">
            <ul className="flex">
              {navItems?.map((item, index) => {
                const isHovered = index === desktopMenuIndex;

                return (
                  <li key={index} className="flex">
                    <Link
                      aria-label={item.navItem?.text}
                      className="group relative flex cursor-pointer items-center px-4 transition"
                      to={item.navItem?.url}
                      onClick={handleDesktopMenuClose}
                      onMouseEnter={() => handleDesktopMenuHoverIn(index)}
                      onMouseLeave={handleDesktopMenuHoverOut}
                    >
                      <p className="text-nav text-current">
                        {item.navItem?.text}
                      </p>

                      <div
                        className={clsx(
                          'absolute left-0 top-[calc(100%_-_2px)] h-[3px] w-full origin-center scale-0 border-t-2 border-t-primary bg-transparent transition after:w-full group-hover:scale-100',
                          isHovered ? 'scale-100' : 'scale-0',
                        )}
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
              style={{color: iconColor}}
              type="button"
            >
              {mobileMenuOpen ? (
                <Svg
                  className="w-full text-current"
                  src="/svgs/close.svg#close"
                  title="Close"
                  viewBox="0 0 24 24"
                />
              ) : (
                <Svg
                  className="w-full text-current"
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
              style={{color: iconColor}}
              type="button"
            >
              <Svg
                className="w-full text-current"
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
            style={{color: iconColor}}
            type="button"
          >
            <Svg
              className="w-full text-current"
              src="/svgs/search.svg#search"
              title="Search"
              viewBox="0 0 24 24"
            />
          </button>

          <Link
            aria-label="Go to account page"
            onClick={closeAll}
            style={{color: iconColor}}
            to={customer ? `/account/orders` : `/account/login`}
          >
            <Svg
              className="w-5 text-current"
              src="/svgs/account.svg#account"
              title="Account"
              viewBox="0 0 24 24"
            />
          </Link>

          <NavigationCart color={iconColor} />
        </div>
      </div>
    );
  },
);

Navigation.displayName = 'Navigation';
