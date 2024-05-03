import {usePromobar} from '~/hooks';

import {Navigation} from './Navigation';
import {DesktopMenu, MobileMenu} from './Menu';
import {Promobar} from './Promobar';
import {useDesktopMenu} from './useDesktopMenu';
import {useMobileMenu} from './useMobileMenu';

export function Header() {
  const {headerHeightClass} = usePromobar();
  const desktopMenuContext = useDesktopMenu();
  const mobileMenuContext = useMobileMenu();

  return (
    <header
      className={`fixed inset-x-0 top-0 z-20 flex flex-col bg-background transition-[height] duration-300 ease-out ${headerHeightClass}`}
    >
      <Promobar />

      <Navigation {...desktopMenuContext} {...mobileMenuContext} />

      <DesktopMenu {...desktopMenuContext} />

      <MobileMenu {...mobileMenuContext} />
    </header>
  );
}

Header.displayName = 'Header';
