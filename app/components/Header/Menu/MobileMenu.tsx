import {memo} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {A11y} from 'swiper/modules';

import {Link, Drawer, Svg} from '~/components';
import {useColorSwatches, useMenu, useSettings} from '~/hooks';

import {ProductItem} from '../../ProductItem';
import type {UseMobileMenuReturn} from '../useMobileMenu';

import {MobileSubmenu} from './MobileSubmenu';

type MobileMenuProps = Pick<
  UseMobileMenuReturn,
  | 'handleCloseMobileMenu'
  | 'handleMobileSubmenu'
  | 'mobileMenuOpen'
  | 'mobileSubmenuContent'
>;

export const MobileMenu = memo(
  ({
    handleCloseMobileMenu,
    mobileMenuOpen,
    mobileSubmenuContent,
    handleMobileSubmenu,
  }: MobileMenuProps) => {
    const {header} = useSettings();
    const {openSearch} = useMenu();
    const swatchesMap = useColorSwatches();

    const {
      links: additionalLinks,
      navItems,
      productsSlider,
    } = {...header?.menu};
    const {products, heading: productsHeading} = {
      ...productsSlider,
    };

    return (
      <Drawer
        ariaName="menu drawer"
        className="lg:hidden"
        onClose={handleCloseMobileMenu}
        open={mobileMenuOpen}
        openFrom="left"
        heading={
          <Link
            aria-label="Go to homepage"
            to="/"
            onClick={handleCloseMobileMenu}
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
            className={`scrollbar-hide size-full overflow-y-auto ${
              mobileSubmenuContent ? 'invisible' : 'visible'
            }`}
          >
            <nav className="mb-8 flex">
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
                          aria-label={item.navItem?.text}
                          className="flex h-14 w-full items-center justify-between gap-5 p-4"
                          onClick={() => handleMobileSubmenu(index)}
                          type="button"
                        >
                          <p className="text-nav flex-1 text-left">
                            {item.navItem?.text}
                          </p>

                          <Svg
                            className="w-5"
                            src="/svgs/arrow-right.svg#arrow-right"
                            title="Arrow Right"
                            viewBox="0 0 24 24"
                          />
                        </button>
                      ) : (
                        <Link
                          aria-label={item.navItem?.text}
                          className="text-nav flex h-14 w-full items-center p-4"
                          to={item.navItem?.url}
                          onClick={handleCloseMobileMenu}
                          newTab={item.navItem?.newTab}
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

            {products?.length > 0 && (
              <div className="mb-8">
                <h3 className="text-h5 mb-2 px-4">{productsHeading}</h3>

                <Swiper
                  modules={[A11y]}
                  slidesPerView={1.3}
                  spaceBetween={16}
                  slidesOffsetBefore={16}
                  slidesOffsetAfter={16}
                  grabCursor
                  className="mb-5"
                >
                  {products.map(({product}, index) => {
                    return (
                      <SwiperSlide key={index}>
                        <ProductItem
                          handle={product.handle}
                          index={index}
                          onClick={handleCloseMobileMenu}
                          swatchesMap={swatchesMap}
                        />
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
            )}

            {additionalLinks?.length > 0 && (
              <ul className="mb-8 flex flex-col gap-1 px-5">
                {additionalLinks.map(({link}, index) => {
                  return (
                    <li key={index}>
                      <Link
                        aria-label={link?.text}
                        to={link?.url}
                        onClick={handleCloseMobileMenu}
                        newTab={link?.newTab}
                        type={link?.type}
                      >
                        {link?.text}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <MobileSubmenu
            handleCloseMobileMenu={handleCloseMobileMenu}
            handleMobileSubmenu={handleMobileSubmenu}
            mobileSubmenuContent={mobileSubmenuContent}
          />
        </div>
      </Drawer>
    );
  },
);

MobileMenu.displayName = 'MobileMenu';
