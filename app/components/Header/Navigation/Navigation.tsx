import {memo, useEffect, useId, useRef} from 'react';
import clsx from 'clsx';

import {Link} from '~/components/Link';
import {Svg} from '~/components/Svg';
import {HEADER_NAVIGATION} from '~/lib/constants';
import {useCustomer, useMenu, useSettings} from '~/hooks';

import {DesktopMenu} from '../Menu/DesktopMenu';
import {desktopMenuHasContent} from '../Menu/desktopMenu.utils';
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
    | 'handleDesktopMenuStayOpen'
  >;

export const Navigation = memo(
  ({
    desktopMenuIndex,
    handleCloseMobileMenu,
    handleDesktopMenuClose,
    handleDesktopMenuHoverIn,
    handleDesktopMenuHoverOut,
    handleDesktopMenuStayOpen,
    handleOpenMobileMenu,
    mobileMenuOpen,
  }: NavigationProps) => {
    const menuIdPrefix = useId();
    const toggleRefs = useRef<(HTMLButtonElement | null)[]>([]);
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

    // Escape dismisses an open dropdown, whether opened by hover or keyboard
    // (WCAG 1.4.13); focus returns to its toggle if it was inside the menu
    useEffect(() => {
      if (desktopMenuIndex === null) return undefined;
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key !== 'Escape') return;
        const toggle = toggleRefs.current[desktopMenuIndex];
        const item = toggle?.closest('li');
        const focusWasInside = item?.contains(document.activeElement);
        handleDesktopMenuClose();
        if (focusWasInside) toggle?.focus();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [desktopMenuIndex]);

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
          <nav aria-label="Main" className="hidden h-full lg:flex">
            <ul className="flex">
              {navItems?.map((item, index) => {
                const isHovered = index === desktopMenuIndex;
                const hasMenu = desktopMenuHasContent(item);
                const menuId = `${menuIdPrefix}-menu-${index}`;

                return (
                  <li
                    key={index}
                    className="flex"
                    onBlur={(e) => {
                      // Close when keyboard focus leaves this item and its menu
                      if (
                        isHovered &&
                        e.relatedTarget &&
                        !e.currentTarget.contains(e.relatedTarget as Node)
                      ) {
                        handleDesktopMenuClose();
                      }
                    }}
                  >
                    <div className="relative flex">
                      <Link
                        className="group relative flex cursor-pointer items-center px-4 transition"
                        to={item.navItem?.url}
                        onClick={handleDesktopMenuClose}
                        onMouseEnter={() => handleDesktopMenuHoverIn(index)}
                        onMouseLeave={handleDesktopMenuHoverOut}
                      >
                        <span className="text-nav text-current">
                          {item.navItem?.text}
                        </span>

                        <div
                          className={clsx(
                            'absolute left-0 top-[calc(100%_-_2px)] h-[3px] w-full origin-center scale-0 border-t-2 border-t-primary bg-transparent transition after:w-full group-hover:scale-100',
                            isHovered ? 'scale-100' : 'scale-0',
                          )}
                        />
                      </Link>

                      {/*
                       * Disclosure toggle for keyboard and screen reader users
                       * (WCAG 2.1.1, 4.1.2). Hidden until focused so the hover
                       * design is unchanged; the link itself still navigates.
                       */}
                      {hasMenu && (
                        <button
                          aria-controls={menuId}
                          aria-expanded={isHovered}
                          aria-label={`${item.navItem?.text} menu`}
                          className="pointer-events-none absolute right-0 top-1/2 flex size-4 -translate-y-1/2 items-center justify-center opacity-0 focus:pointer-events-auto focus:opacity-100"
                          onClick={() =>
                            isHovered
                              ? handleDesktopMenuClose()
                              : handleDesktopMenuHoverIn(index)
                          }
                          ref={(el) => {
                            toggleRefs.current[index] = el;
                          }}
                          type="button"
                        >
                          <Svg
                            className={clsx(
                              'w-3 text-current transition',
                              isHovered && 'rotate-180',
                            )}
                            src="/svgs/chevron-down.svg#chevron-down"
                            viewBox="0 0 24 24"
                          />
                        </button>
                      )}
                    </div>

                    {hasMenu && (
                      <DesktopMenu
                        anotherMenuOpen={
                          desktopMenuIndex !== null && !isHovered
                        }
                        handleDesktopMenuClose={handleDesktopMenuClose}
                        handleDesktopMenuHoverOut={handleDesktopMenuHoverOut}
                        handleDesktopMenuStayOpen={handleDesktopMenuStayOpen}
                        id={menuId}
                        isActiveMenu={isHovered}
                        item={item}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <button
              aria-expanded={mobileMenuOpen}
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
