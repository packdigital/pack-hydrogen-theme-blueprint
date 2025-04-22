import {memo} from 'react';
import clsx from 'clsx';

import {usePromobar} from '~/hooks';

import {Navigation, TransparentNavigation} from './Navigation';
import {DesktopMenu, MobileMenu} from './Menu';
import {Promobar} from './Promobar';
import {useDesktopMenu} from './useDesktopMenu';
import {useMobileMenu} from './useMobileMenu';

export const Header = memo(() => {
  const {headerHeightClass, isTransparentNavPage} = usePromobar();
  const desktopMenuContext = useDesktopMenu();
  const mobileMenuContext = useMobileMenu();

  /* Header is transparent for page handles set in site settings */
  if (isTransparentNavPage) {
    return (
      <header
        className={clsx(
          'fixed inset-x-0 top-0 z-20 flex flex-col transition-[height] duration-300 ease-out',
          headerHeightClass,
        )}
      >
        <TransparentNavigation />
      </header>
    );
  }

  return (
    <header
      className={clsx(
        'fixed inset-x-0 top-0 z-20 flex flex-col bg-background transition-[height] duration-300 ease-out',
        headerHeightClass,
      )}
    >
      <Promobar />

      <Navigation {...desktopMenuContext} {...mobileMenuContext} />

      <DesktopMenu {...desktopMenuContext} />

      <MobileMenu {...mobileMenuContext} />
    </header>
  );
});

Header.displayName = 'Header';
