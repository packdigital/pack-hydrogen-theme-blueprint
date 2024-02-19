import {useSiteSettings} from '@pack/react';

import type {SiteSettings} from '~/lib/types';

import {Navigation} from './Navigation';
import {Menu} from './Menu';
import {MenuDrawer} from './MenuDrawer';
import {Promobar} from './Promobar';
import {useMenu} from './useMenu';
import {useMenuDrawer} from './useMenuDrawer';
import {usePromobar} from './usePromobar';

export function Header() {
  const siteSettings = useSiteSettings() as SiteSettings;
  const settings = siteSettings?.settings?.header;
  const {
    menuContent,
    handleMenuClose,
    handleMenuStayOpen,
    handleMenuHoverIn,
    handleMenuHoverOut,
  } = useMenu({settings});
  const {promobarDisabled, promobarHeight, promobarHidden, setPromobarHidden} =
    usePromobar({settings});
  const {
    menuDrawerOpen,
    nestedDrawerContent,
    handleCloseDrawer,
    handleNestedDrawer,
    handleOpenDrawer,
  } = useMenuDrawer({settings});

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-20 flex flex-col bg-background transition-[height] duration-300 ease-out ${
        promobarHidden || promobarDisabled
          ? 'h-[var(--header-height)]'
          : 'h-[calc(var(--header-height)+var(--promobar-height))]'
      }`}
    >
      <Promobar
        promobarDisabled={promobarDisabled}
        promobarHeight={promobarHeight}
        promobarHidden={promobarHidden}
        setPromobarHidden={setPromobarHidden}
        settings={settings}
      />

      <Navigation
        handleOpenDrawer={handleOpenDrawer}
        handleMenuClose={handleMenuClose}
        handleMenuHoverIn={handleMenuHoverIn}
        handleMenuHoverOut={handleMenuHoverOut}
        menuContent={menuContent}
        settings={settings}
      />

      <Menu
        handleMenuClose={handleMenuClose}
        handleMenuStayOpen={handleMenuStayOpen}
        handleMenuHoverOut={handleMenuHoverOut}
        menuContent={menuContent}
      />

      <MenuDrawer
        handleCloseDrawer={handleCloseDrawer}
        handleNestedDrawer={handleNestedDrawer}
        menuDrawerOpen={menuDrawerOpen}
        nestedDrawerContent={nestedDrawerContent}
        settings={settings}
      />
    </header>
  );
}

Header.displayName = 'Header';
