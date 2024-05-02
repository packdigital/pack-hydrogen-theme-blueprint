import {useSettings} from '~/hooks';

import {Navigation} from './Navigation';
import {Menu} from './Menu';
import {MenuDrawer} from './MenuDrawer';
import {Promobar} from './Promobar';
import {useMenu} from './useMenu';
import {useMenuDrawer} from './useMenuDrawer';
import {usePromobar} from './usePromobar';

export function Header() {
  const {header} = useSettings();
  const {
    menuContent,
    handleMenuClose,
    handleMenuStayOpen,
    handleMenuHoverIn,
    handleMenuHoverOut,
  } = useMenu({settings: header});
  const {promobarDisabled, promobarHeight, promobarHidden, setPromobarHidden} =
    usePromobar({settings: header});
  const {
    menuDrawerOpen,
    nestedDrawerContent,
    handleCloseDrawer,
    handleNestedDrawer,
    handleOpenDrawer,
  } = useMenuDrawer({settings: header});

  return (
    <header
      className={`fixed inset-x-0 top-0 z-20 flex flex-col bg-background transition-[height] duration-300 ease-out ${
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
        settings={header}
      />

      <Navigation
        handleOpenDrawer={handleOpenDrawer}
        handleMenuClose={handleMenuClose}
        handleMenuHoverIn={handleMenuHoverIn}
        handleMenuHoverOut={handleMenuHoverOut}
        menuContent={menuContent}
        settings={header}
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
        settings={header}
      />
    </header>
  );
}

Header.displayName = 'Header';
