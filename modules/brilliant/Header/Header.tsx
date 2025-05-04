import {memo} from 'react';

import {DesktopMenu} from './Menu/DesktopMenu';
import {Navigation, TransparentNavigation} from './Navigation';
import {Promobar} from './Promobar';

import {MobileMenu} from '~/components/Header/Menu';
import {useDesktopMenu} from '~/components/Header/useDesktopMenu';
import {useMobileMenu} from '~/components/Header/useMobileMenu';
import {usePromobar} from '~/hooks';

export const Header = memo(() => {
  const {headerHeightClass, isTransparentNavPage} = usePromobar();
  const desktopMenuContext = useDesktopMenu();
  const mobileMenuContext = useMobileMenu();

  /* Header is transparent for page handles set in site settings */
  if (isTransparentNavPage) {
    return (
      <header
        className={`fixed inset-x-0 top-0 z-20 flex flex-col transition-[height] duration-300 ease-out ${headerHeightClass}`}
      >
        <TransparentNavigation />
      </header>
    );
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-20 flex flex-col bg-primary transition-[height] duration-300 ease-out ${headerHeightClass}`}
    >
      <Promobar />

      <Navigation {...desktopMenuContext} {...mobileMenuContext} />

      <DesktopMenu {...desktopMenuContext} />

      <MobileMenu {...mobileMenuContext} />
    </header>
  );
});

Header.displayName = 'Header';
