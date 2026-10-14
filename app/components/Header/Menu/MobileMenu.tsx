import {memo, useEffect, useId, useRef} from 'react';
import clsx from 'clsx';

import {Link} from '~/components/Link';
import {Drawer} from '~/components/Drawer';
import {Svg} from '~/components/Svg';
import {useMenu, useSettings} from '~/hooks';

import type {UseMobileMenuReturn} from '../useMobileMenu';

import {MobileSubmenu} from './MobileSubmenu';
import {MobileMenuProductsSlider} from './MobileMenuProductsSlider';

type MobileMenuProps = Pick<
  UseMobileMenuReturn,
  | 'handleCloseMobileMenu'
  | 'handleMobileSubmenu'
  | 'mobileMenuOpen'
  | 'mobileSubmenuIndex'
>;

export const MobileMenu = memo(
  ({
    handleCloseMobileMenu,
    handleMobileSubmenu,
    mobileMenuOpen,
    mobileSubmenuIndex,
  }: MobileMenuProps) => {
    const {header} = useSettings();
    const {openSearch} = useMenu();
    const submenuIdPrefix = useId();
    const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const prevSubmenuIndex = useRef<number | null>(null);

    // Move focus into a submenu when it opens, and back to its trigger when it
    // closes, so focus never sits on hidden content (WCAG 2.4.3)
    useEffect(() => {
      const prevIndex = prevSubmenuIndex.current;
      prevSubmenuIndex.current = mobileSubmenuIndex;
      if (typeof mobileSubmenuIndex === 'number') {
        document
          .getElementById(`${submenuIdPrefix}-${mobileSubmenuIndex}-back`)
          ?.focus();
      } else if (typeof prevIndex === 'number' && mobileMenuOpen) {
        triggerRefs.current[prevIndex]?.focus();
      }
    }, [mobileSubmenuIndex]);

    const {
      links: additionalLinks,
      navItems,
      productsSlider,
    } = {...header?.menu};
    const activeSubmenu =
      typeof mobileSubmenuIndex === 'number'
        ? navItems?.[mobileSubmenuIndex]
        : null;
    const activeSubmenuHasContent = Boolean(
      activeSubmenu &&
      (activeSubmenu.imageLinks?.length > 0 ||
        activeSubmenu.links?.length > 0 ||
        !!activeSubmenu.mainLink?.text),
    );

    return (
      <Drawer
        ariaName="menu"
        className="lg:hidden"
        onClose={handleCloseMobileMenu}
        open={mobileMenuOpen}
        openFrom="left"
        unmount={false}
        heading={
          <Link
            aria-label="Go to homepage"
            onClick={handleCloseMobileMenu}
            to="/"
          >
            <Svg
              className="h-8 text-text"
              src="/svgs/pack-logo.svg#pack-logo"
              title="Storefront logo"
              viewBox="0 0 44 34"
            />
          </Link>
        }
        secondHeaderElement={
          <button
            aria-label="Open search drawer"
            className="absolute right-4 top-1/2 -translate-y-1/2"
            onClick={() => {
              handleCloseMobileMenu();
              openSearch();
            }}
            type="button"
          >
            <Svg
              className="w-5"
              src="/svgs/search.svg#search"
              title="Search"
              viewBox="0 0 24 24"
            />
          </button>
        }
      >
        <div className="relative w-full flex-1 overflow-x-hidden">
          <div
            className={clsx(
              'scrollbar-hide size-full overflow-y-auto',
              activeSubmenuHasContent ? 'invisible' : 'visible',
            )}
          >
            <nav aria-label="Main" className="mb-8 flex">
              <ul className="flex w-full flex-col">
                {navItems?.map((item, index) => {
                  const hasContent =
                    item.links?.length > 0 || item.imageLinks?.length > 0;

                  return (
                    <li
                      key={index}
                      className="flex min-h-14 w-full border-b border-b-border"
                    >
                      {hasContent ? (
                        <button
                          aria-controls={`${submenuIdPrefix}-${index}`}
                          aria-expanded={mobileSubmenuIndex === index}
                          className="flex h-14 w-full items-center justify-between gap-5 p-4"
                          onClick={() => handleMobileSubmenu(index)}
                          ref={(el) => {
                            triggerRefs.current[index] = el;
                          }}
                          type="button"
                        >
                          <span className="text-nav flex-1 text-left">
                            {item.navItem?.text}
                          </span>

                          <Svg
                            className="w-5"
                            src="/svgs/arrow-right.svg#arrow-right"
                            title="Arrow Right"
                            viewBox="0 0 24 24"
                          />
                        </button>
                      ) : (
                        <Link
                          className="text-nav flex h-14 w-full items-center p-4"
                          newTab={item.navItem?.newTab}
                          onClick={handleCloseMobileMenu}
                          to={item.navItem?.url}
                          type={item.navItem?.type}
                        >
                          {item.navItem?.text}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            {mobileMenuOpen && productsSlider?.products?.length > 0 && (
              <MobileMenuProductsSlider
                handleCloseMobileMenu={handleCloseMobileMenu}
                productsSlider={productsSlider}
              />
            )}

            {additionalLinks?.length > 0 && (
              <nav aria-label="Secondary" className="mb-8">
                <ul className="flex flex-col gap-1 px-5">
                  {additionalLinks.map(({link}, index) => {
                    return (
                      <li key={index}>
                        <Link
                          newTab={link?.newTab}
                          onClick={handleCloseMobileMenu}
                          to={link?.url}
                          type={link?.type}
                        >
                          {link?.text}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            )}
          </div>

          <MobileSubmenu
            activeSubmenuHasContent={activeSubmenuHasContent}
            handleCloseMobileMenu={handleCloseMobileMenu}
            handleMobileSubmenu={handleMobileSubmenu}
            mobileSubmenuIndex={mobileSubmenuIndex}
            navItems={navItems}
            submenuIdPrefix={submenuIdPrefix}
          />
        </div>
      </Drawer>
    );
  },
);

MobileMenu.displayName = 'MobileMenu';
